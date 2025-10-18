import { db, isPrismaError, getFileService } from "./db/client.js";
import { facultyRepo } from "./facultyRepo.js";
import * as InfrastructureError from "./errors/index.js";
import * as FileStorageError from "@reuc/file-storage/errors/index.js";

const fileService = getFileService();

export const applicationRepo = {
  /**
   * Orchestrates the creation of a new application, including handling
   * file uploads and complex relational data within a single transaction.
   * @param {object} application - The core application data and related IDs.
   * @param {object} file - An object containing either a `customImage` to upload or a `defaultImage` to link.
   *
   * @throws {InfrastructureError.FileOperationError} If the file upload or processing fails.
   * @throws {InfrastructureError.ConflictError} If exist a constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async save(application, file) {
    let savedFileMeta = null;

    try {
      savedFileMeta = await _handleFileUpload(file);
    } catch (err) {
      if (err instanceof FileStorageError.FileStorageError)
        throw new InfrastructureError.FileOperationError(err.message, {
          cause: err.cause,
          details: err.details,
        });

      throw InfrastructureError.InfrastructureError(err.message, {
        cause: err,
      });
    }

    try {
      const createData = _buildApplicationCreateData(application);

      return await db.$transaction(async (tx) => {
        const newApplication = await tx.application.create({
          data: createData,
          select: {
            uuid_application: true,
            uuidOutsider: true,
            title: true,
            shortDescription: true,
            description: true,
            deadline: true,
          },
        });

        await _createFileLinksInTx(tx, file, savedFileMeta, newApplication);

        return newApplication;
      });
    } catch (err) {
      await _cleanupOrphanedFile(savedFileMeta);

      if (isPrismaError(err)) {
        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ConflictError(
            `An application with this ${field} failed to create the application.`,
            { details: { field } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while creating outsider: ${err.message}`,
          { cause: err }
        );
      }

      const context = JSON.stringify({ application, file });
      console.error(
        `Infrastructure error (applicationRepo.save) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while creating application",
        { cause: err }
      );
    }
  },

  /**
   * Retrieves a paginated list of applications that are not yet linked to a project,
   * optionally filtered by faculty.
   * @param {object} options - The filtering and pagination options.
   * @param {string} [options.faculty] - The name of the faculty to filter by.
   * @param {number} [options.page] - The current page number for pagination.
   * @param {number} [options.perPage] - The number of items per page.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getLimitedByFacultyWithoutProjectRelation({
    faculty = "",
    page = 1,
    perPage = 50,
  }) {
    try {
      const where = await _buildGetLimitedWhereClause(faculty);
      const skip = (page - 1) * perPage;

      // Step 1: Query the primary data
      const [applications, totalItems] = await _fetchApplicationsAndCount(
        where,
        { skip, take: perPage }
      );

      if (applications.length === 0)
        return {
          applications: [],
          metadata: { totalItems: 0, totalPages: 0, currentPage: page },
        };

      // Step 2: Query and prepare the related data
      const applicationIds = applications.map((app) => app.uuid_application);
      const bannerMap = await _fetchAndMapBannerUrls(applicationIds);

      // Step 3: Stitch the data together
      const applicationWithBanners = applications.map((app) => ({
        ...app,
        bannerUrl: bannerMap.get(app.uuid_application) || null,
      }));

      return {
        applications: applicationWithBanners,
        metadata: {
          totalItems,
          totalPages: Math.ceil(totalItems / perPage),
          currentPage: page,
        },
      };
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying applications: ${err.message}`,
          { cause: err }
        );

      const context = JSON.stringify({ faculty, page, perPage });
      console.error(
        `Infrastructure error (applicationRepo.getLimitedByFacultyWithoutProjectRelation) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while quering applications",
        { cause: err }
      );
    }
  },
};

/**
 * A private helper to build the data payload for creating an application.
 * @param {object} application - The raw application data from the domain layer.
 * @returns {object} The formatted data object for Prisma's `create` method.
 */
function _buildApplicationCreateData(application) {
  const {
    applicationProjectType = [],
    applicationFaculty = [],
    applicationProblemType = [],
    applicationCustomProblemType = null,
    ...applicationData
  } = application;

  const createData = {
    ...applicationData,
    applicationProjectType: {
      create: applicationProjectType.map((id) => ({ project_type_id: id })),
    },
    applicationFaculty: {
      create: applicationFaculty.map((id) => ({ faculty_id: id })),
    },
    applicationProblemType: {
      create: applicationProblemType.map((id) => ({ problem_type_id: id })),
    },
  };

  // Handle the custom problem type if it exists
  if (applicationCustomProblemType) {
    createData.applicationProblemType.create.push({
      problemTypeId: {
        connectOrCreate: {
          where: { name: applicationCustomProblemType },
          create: { name: applicationCustomProblemType },
        },
      },
    });
  }

  return createData;
}

/**
 * A private helper to handle the file upload logic.
 * @param {object} file - The file object, containing either a custom or default image.
 */
async function _handleFileUpload(file) {
  if (file?.customImage?.filePayload) {
    const { filePayload, fileDescriptor } = file.customImage;

    return await fileService.saveFile(filePayload.buffer, {
      originalName: fileDescriptor.name,
      mimetype: filePayload.mimetype,
      targetModel: fileDescriptor.modelTarget,
      purpose: fileDescriptor.purpose,
      processorOptions: { format: "webp", quality: 70 },
    });
  }

  return null;
}

/**
 * A private helper to create file and link records within a transaction.
 * @param {object} tx - The Prisma transaction client.
 * @param {object} file - The original file object.
 * @param {object} savedFileMeta - Metadata from a newly uploaded file.
 * @param {object} newApplication - The newly created application record.
 */
async function _createFileLinksInTx(tx, file, savedFileMeta, newApplication) {
  // Case 1: A new file was uploaded. Create the File record and its Link.
  if (savedFileMeta) {
    await tx.file.create({
      data: {
        ...savedFileMeta,
        File_Link: {
          create: {
            modelTarget: savedFileMeta.modelTarget,
            uuidTarget: newApplication.uuid_application,
            purpose: savedFileMeta.purpose,
          },
        },
      },
    });
    return;
  }

  // Case 2: A default image was chosen. Find the existing asset and create a new Link to it.
  if (file?.defaultImage) {
    const { name, modelTarget, purpose } = file.defaultImage;
    const existingAsset = await tx.file.findFirst({
      where: { originalName: name, isAsset: true },
      orderBy: { createdAt: "asc" },
    });

    if (existingAsset) {
      await tx.file_Link.create({
        data: {
          modelTarget,
          purpose,
          uuidTarget: newApplication.uuid_application,
          uuidFile: existingAsset.uuid_file,
        },
      });
    }
  }
}

/**
 * A private helper to clean up a file from storage if the DB transaction fails.
 * @param {object} savedFileMeta - Metadata of the file to delete.
 */
async function _cleanupOrphanedFile(savedFileMeta) {
  if (savedFileMeta?.storedPath) {
    try {
      await fileService.deleteFile(savedFileMeta.storedPath);
    } catch (err) {
      console.error(
        "Infrastructure Critical Error: Failed to delete orphaned file after DB transaction failed:",
        err
      );
    }
  }
}

/**
 * A private helper to build the `where` clause for the application query.
 * @param {string} facultyName - The optional name of the faculty to filter by.
 */
async function _buildGetLimitedWhereClause(facultyName) {
  const where = { project: { none: {} } };

  if (facultyName) {
    const facultyFound = await facultyRepo.findByName(facultyName);

    if (facultyFound) {
      where.applicationFaculty = {
        some: { faculty: facultyFound.faculty_id },
      };
    }
  }

  return where;
}

/**
 * A private helper to fetch the primary application data and total count.
 * @param {object} where - The Prisma `where` clause.
 * @param {object} pagination - An object with `skip` and `take` values.
 * @param {number} pagination.skip - The offset from where to start fetching.
 * @param {number} pagination.take - The limit of applications to fetch.
 */
async function _fetchApplicationsAndCount(where, { skip, take }) {
  return db.$transaction([
    db.application.findMany({
      where,
      select: { uuid_application: true, title: true, shortDescription: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    db.application.count({ where }),
  ]);
}

/**
 * A private helper to fetch banner links and return them as a lookup map.
 * @param {string[]} applicationIds - An array of application UUIDs.
 */
async function _fetchAndMapBannerUrls(applicationIds) {
  const bannerLinks = await db.file_Link.findMany({
    where: {
      modelTarget: "APPLICATION",
      purpose: "BANNER",
      uuidTarget: { in: applicationIds },
    },
    select: { uuidTarget: true, modelTarget: true, purpose: true },
  });

  return new Map(
    bannerLinks.map((link) => [
      link.uuidTarget,
      `/${link.modelTarget}/${link.purpose}/${link.uuidTarget}`,
    ])
  );
}

/**
### An admin wants to list all applications submitted to the Faculty of Engineering.
const applications = await prisma.application.findMany({
  where: {
    applicationFaculty: {
      some: {
        facultyTypeId: {
          name: 'Engineering',
        },
      },
    },
  },
  include: {
    outsider: true,
    applicationProjectType: {
      include: { projectTypeId: true },
    },
    applicationProblemType: {
      include: { problemTypeId: true },
    },
  },
});

### The university wants to see all "Research" applications that address a "Social" issue.
const filtered = await prisma.application.findMany({
  where: {
    applicationProjectType: {
      some: {
        projectTypeId: { name: 'Research' },
      },
    },
    applicationProblemType: {
      some: {
        problemTypeId: { name: 'Social' },
      },
    },
  },
});

### User logs in and wants to view their past submissions.
await prisma.application.findMany({
  where: { uuidOutsider: outsiderId },
  include: {
    project: true,
    applicationProjectType: {
      include: { projectTypeId: true },
    },
    applicationFaculty: {
      include: { facultyTypeId: true },
    },
    applicationProblemType: {
      include: { problemTypeId: true },
    },
  },
});
 */
