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
   * @param {object} banner - An object containing either a `customBanner` to upload or a `defaultBannerUuid` to link.
   * @param {Array<object>} attachments - An array of attachment objects to upload.
   *
   * @throws {InfrastructureError.FileOperationError} If the file upload or processing fails.
   * @throws {InfrastructureError.ForeignKeyConstraintError} If exist a constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async save(application, banner, attachments) {
    let allSavedFileMetas = [];

    try {
      // 1. Handle all file uploads *before* the transaction.
      allSavedFileMetas = await _handleFileUploads(banner, attachments);
    } catch (err) {
      if (err instanceof FileStorageError.FileStorageError)
        throw new InfrastructureError.FileOperationError(err.message, {
          cause: err.cause,
          details: err.details,
        });

      throw new InfrastructureError.InfrastructureError(err.message, {
        cause: err,
      });
    }

    // Separate the metas for easier handling
    const bannerMeta = allSavedFileMetas.find((m) => m.purpose === "BANNER");
    const attachmentsMeta = allSavedFileMetas.filter(
      (m) => m.purpose === "ATTACHMENT"
    );

    try {
      // 2. Build the main application data
      const createData = _buildApplicationCreateData(application);

      // 3. Start the database transaction
      return await db.$transaction(async (tx) => {
        // 3a. Create the application
        const newApplication = await tx.application.create({
          data: createData,
          select: {
            uuid_application: true,
            uuidAuthor: true,
            title: true,
            shortDescription: true,
            description: true,
            deadline: true,
          },
        });

        // 3b. Create all file links (banner + attachments)
        await _createFileLinksInTx(
          tx,
          banner,
          bannerMeta,
          attachmentsMeta,
          newApplication
        );

        return newApplication;
      });
    } catch (err) {
      // 4. If transaction fails, clean up *all* orphaned files.
      await _cleanupOrphanedFiles(allSavedFileMetas);

      // 5. Translate and re-throw database errors
      if (isPrismaError(err)) {
        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `An application with this ${field} failed to create the application.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while creating application: ${err.message}`,
          { cause: err }
        );
      }

      if (err instanceof InfrastructureError.InfrastructureError) throw err;

      // 6. Handle any other unexpected errors
      const context = JSON.stringify({ application, banner, attachments });
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
   * Updates an application's metadata and replaces its relational classifications.
   * @param {string} uuid - The UUID of the application to update.
   * @param {object} applicationUpdates - The new application data to update (title, desc, relations).
   *
   * @throws {InfrastructureError.NotFoundError} If the application does not exist.
   * @throws {InfrastructureError.ForeignKeyConstraintError} If exist a constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For unexpected Prisma errors.
   */
  async update(uuid, applicationUpdates) {
    try {
      const updatePayload = _buildApplicationUpdateData(applicationUpdates);

      return await db.application.update({
        where: { uuid_application: uuid },
        data: updatePayload,
        select: {
          uuid_application: true,
          uuidAuthor: true,
          title: true,
          shortDescription: true,
          description: true,
          deadline: true,
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `An application with this ${field} failed to update the application.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }

        if (err.code === "P2025") {
          const message = err.meta.cause;

          throw new InfrastructureError.NotFoundError(
            `No ${uuid} application found to update.`,
            { details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while updating application: ${err.message}`,
          { cause: err }
        );
      }

      const context = JSON.stringify({ uuid, applicationUpdates });
      console.error(
        `Infrastructure error (applicationRepo.update) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while updating application",
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
    faculty = undefined,
    page = 1,
    perPage = 50,
  }) {
    try {
      const where = await _buildGetLimitedWhereClause(faculty);
      const sort = { createdAt: "desc" };
      const skip = (page - 1) * perPage;
      const take = perPage;

      const [applicationsRaw, totalItems] = await db.$transaction([
        db.application.findMany({
          where,
          select: {
            uuid_application: true,
            title: true,
            shortDescription: true,
          },
          orderBy: sort,
          skip,
          take,
        }),
        db.application.count({ where }),
      ]);

      const queryParams = {};
      if (faculty) {
        queryParams.faculty = faculty;
      }

      const totalPages = Math.ceil(totalItems / perPage);

      return {
        records: applicationsRaw,
        metadata: {
          pagination: {
            page: Number(page),
            perPage: Number(perPage),
            totalPages,
            filteredItems: totalItems,
          },
          query: queryParams,
          sort,
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
  /**
   * Retrieves a full detailed application, with application data, file_links BANNER and
   * ATTACHMENT.
   * @param {string} uuid - The UUID of the application to search for.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getDetailedApplication(uuid) {
    try {
      const applicationData = await db.application.findUnique({
        where: { uuid_application: uuid },
        select: {
          // --- User & Organization ---
          author: {
            select: {
              uuid_user: true,
              firstName: true,
              middleName: true,
              lastName: true,
              outsider: {
                select: {
                  location: true,
                  phoneNumber: true,
                  organizationName: true,
                },
              },
            },
          },
          // --- Application Details ---
          title: true,
          shortDescription: true,
          description: true,
          deadline: true,
          createdAt: true,
          applicationStatus: { select: { name: true, slug: true } },
          project: { select: { uuid_project: true } },
          // --- Related Types (Many-to-Many) ---
          applicationProjectType: {
            select: {
              projectTypeId: {
                select: {
                  project_type_id: true,
                  name: true,
                },
              },
            },
          },
          applicationFaculty: {
            select: {
              facultyTypeId: {
                select: {
                  faculty_id: true,
                  name: true,
                },
              },
            },
          },
          applicationProblemType: {
            select: {
              problemTypeId: {
                select: {
                  problem_type_id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return applicationData;
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying application details: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (applicationRepo.getDetailedApplication) with UUID ${uuid}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while quering application",
        { cause: err }
      );
    }
  },
  /**
   * Retrieves a paginated list of all applications owned by a specfic user.
   * @param {object} options - The filtering and pagination options.
   * @param {string} [options.uuidAuthor] - The unique indentifier ID of a user to filter by.
   * @param {number} [options.page] - The current page number for pagination.
   * @param {number} [options.perPage] - The number of items per page.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getAllByAuthor({ uuidAuthor, page = 1, perPage = 50 }) {
    try {
      const where = { uuidAuthor };
      const sort = { createdAt: "asc" };
      const skip = (page - 1) * perPage;
      const take = perPage;

      const [applicationsRaw, totalItems] = await db.$transaction([
        db.application.findMany({
          where,
          select: {
            uuid_application: true,
            title: true,
            shortDescription: true,
            applicationStatus: { select: { name: true, slug: true } },
          },
          orderBy: sort,
          skip,
          take,
        }),
        db.application.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / perPage);

      return {
        records: applicationsRaw,
        metadata: {
          pagination: {
            page: Number(page),
            perPage: Number(perPage),
            totalPages,
            filteredItems: totalItems,
          },
          query: where,
          sort,
        },
      };
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying applications by author: ${err.message}`,
          { cause: err }
        );

      const context = JSON.stringify({ uuidAuthor, page, perPage });
      console.error(
        `Infrastructure error (applicationRepo.getByUuidUser) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while quering applications by author",
        { cause: err }
      );
    }
  },
  /**
   * Confirm the application exist
   * @param {string} uuid - The UUID of the application to search for.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getByUuid(uuid) {
    try {
      return await db.application.findUnique({
        where: { uuid_application: uuid },
        select: {
          uuid_application: true,
          uuidAuthor: true,
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while confirm existing application: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (applicationRepo.exist) with UUID ${uuid}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error confirm existing application",
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
    uuidAuthor,
    applicationProjectType = [],
    applicationFaculty = [],
    applicationProblemType = [],
    applicationCustomProblemType = null,
    ...applicationData
  } = application;

  const createData = {
    ...applicationData,
    author: { connect: { uuid_user: uuidAuthor } },
    applicationStatus: { connect: { slug: "in_review" } },
    applicationProjectType: {
      create: applicationProjectType.map((id) => ({
        projectTypeId: { connect: { project_type_id: id } },
      })),
    },
    applicationFaculty: {
      create: applicationFaculty.map((id) => ({
        facultyTypeId: { connect: { faculty_id: id } },
      })),
    },
    applicationProblemType: {
      create: applicationProblemType.map((id) => ({
        problemTypeId: { connect: { problem_type_id: id } },
      })),
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
 * Private helper to construct the Prisma Update input.
 * It maps arrays of IDs to "delete all existing relations -> connect new ones".
 */
function _buildApplicationUpdateData(application) {
  const {
    applicationProjectType,
    applicationFaculty,
    applicationProblemType,
    applicationCustomProblemType,
    ...otherFields
  } = application;

  const updateData = {
    ...otherFields,
  };

  if (applicationProjectType) {
    updateData.applicationProjectType = {
      deleteMany: {},
      create: applicationProjectType.map((id) => ({
        projectTypeId: { connect: { project_type_id: id } },
      })),
    };
  }

  if (applicationFaculty) {
    updateData.applicationFaculty = {
      deleteMany: {},
      create: applicationFaculty.map((id) => ({
        facultyTypeId: { connect: { faculty_id: id } },
      })),
    };
  }

  if (
    applicationProblemType !== undefined ||
    applicationCustomProblemType !== undefined
  ) {
    const createOperations = [];

    if (applicationProblemType && Array.isArray(applicationProblemType)) {
      createOperations.push(
        ...applicationProblemType.map((id) => ({
          problemTypeId: { connect: { problem_type_id: id } },
        }))
      );
    }

    if (applicationCustomProblemType) {
      createOperations.push({
        problemTypeId: {
          connectOrCreate: {
            where: { name: applicationCustomProblemType },
            create: { name: applicationCustomProblemType },
          },
        },
      });
    }

    updateData.applicationProblemType = {
      deleteMany: {},
      create: createOperations,
    };
  }

  return updateData;
}

/**
 * A private helper to handle uploading all files (banner + attachments).
 * @param {object} banner - The banner object from the domain.
 * @param {Array<object>} attachments - The attachments array from the domain.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of all saved file metadata.
 */
async function _handleFileUploads(banner, attachments) {
  const filesToUpload = [];

  // 1. Check for a custom banner to upload
  if (banner?.customBanner?.filePayload) {
    const { filePayload, fileDescriptor } = banner.customBanner;

    filesToUpload.push({
      buffer: filePayload.buffer,
      descriptor: {
        originalName: fileDescriptor.name,
        mimetype: filePayload.mimetype,
        targetModel: fileDescriptor.modelTarget,
        purpose: fileDescriptor.purpose,
        processorOptions: { format: "webp", quality: 70 },
      },
    });
  }

  // 2. Check for attachments to upload
  if (attachments && attachments.length > 0) {
    for (const attachment of attachments) {
      const { filePayload, fileDescriptor } = attachment;

      filesToUpload.push({
        buffer: filePayload.buffer,
        descriptor: {
          originalName: fileDescriptor.name,
          mimetype: filePayload.mimetype,
          targetModel: fileDescriptor.modelTarget,
          purpose: fileDescriptor.purpose,
        },
      });
    }
  }

  // 3. Upload all files in parallel
  if (filesToUpload.length > 0) {
    return Promise.all(
      filesToUpload.map((f) => fileService.saveFile(f.buffer, f.descriptor))
    );
  }

  return [];
}

/**
 * A private helper to create file and link records within a transaction.
 * @param {object} tx - The Prisma transaction client.
 * @param {object} banner - The original domain banner object.
 * @param {object} bannerMeta - Metadata from a *newly uploaded* banner.
 * @param {Array<object>} attachmentsMeta - Metadata from *newly uploaded* attachments.
 * @param {object} newApplication - The newly created application record.
 */
async function _createFileLinksInTx(
  tx,
  banner,
  bannerMeta,
  attachmentsMeta,
  newApplication
) {
  // --- 1. Handle Banner Link ---
  // Enforce 1:1 rule by deleting any existing BANNER link first.
  await tx.file_Link.deleteMany({
    where: {
      modelTarget: "APPLICATION",
      uuidTarget: newApplication.uuid_application,
      purpose: "BANNER",
    },
  });

  // Case 1a: A new custom banner was uploaded. Create File and Link.
  if (bannerMeta) {
    const {
      storage: _1,
      modelTarget: bannerModelTarget,
      uuidTarget: _2,
      purpose: bannerPurpose,
      ...bannerData
    } = bannerMeta;

    await tx.file.create({
      data: {
        ...bannerData,
        File_Link: {
          create: {
            modelTarget: bannerModelTarget,
            uuidTarget: newApplication.uuid_application,
            purpose: bannerPurpose,
          },
        },
      },
    });
  }
  // Case 1b: A default banner was chosen. Find existing asset and create new Link.
  else if (banner?.defaultBannerUuid) {
    const existingAsset = await tx.file.findFirst({
      where: {
        uuid_file: banner.defaultBannerUuid.defaultBannerUuid,
        isAsset: true,
      },
    });

    if (existingAsset) {
      await tx.file_Link.create({
        data: {
          modelTarget: banner.defaultBannerUuid.modelTarget,
          purpose: banner.defaultBannerUuid.purpose,
          uuidTarget: newApplication.uuid_application,
          uuidFile: existingAsset.uuid_file,
        },
      });
    } else {
      throw new InfrastructureError.ForeignKeyConstraintError(
        `An application with this defaultBannerUuid failed to create the application.`,
        {
          details: {
            field: "defaultBannerUuid",
            rule: "foreign_key_violation",
          },
        }
      );
    }
  }

  // --- 2. Handle Attachment Links ---
  // Enforce 1:N rule by creating all the attachments and linking to the same application.
  if (attachmentsMeta && attachmentsMeta.length > 0) {
    // One-by-one to create both File and File_Link
    for (const meta of attachmentsMeta) {
      const {
        storage: _1,
        modelTarget: attachmentModelTarget,
        uuidTarget: _2,
        purpose: attachmentPurpose,
        ...attachmentData
      } = meta;

      await tx.file.create({
        data: {
          ...attachmentData,
          File_Link: {
            create: {
              modelTarget: attachmentModelTarget,
              uuidTarget: newApplication.uuid_application,
              purpose: attachmentPurpose,
            },
          },
        },
      });
    }
  }
}

/**
 * A private helper to clean up *all* files from storage if the DB transaction fails.
 * @param {Array<object>} allSavedFileMetas - Array of metadata of all files to delete.
 */
async function _cleanupOrphanedFiles(allSavedFileMetas) {
  if (!allSavedFileMetas || allSavedFileMetas.length === 0) {
    return;
  }

  // Delete all uploaded files in parallel
  try {
    await Promise.all(
      allSavedFileMetas.map((meta) => {
        if (meta?.storedPath) {
          return fileService.deleteFile(meta.storedPath);
        }

        return Promise.resolve();
      })
    );
  } catch (err) {
    console.error(
      "Infrastructure Critical Error: Failed to delete orphaned files after DB transaction failed:",
      err
    );
  }
}

/**
 * A private helper to build the `where` clause for the application query.
 * @param {string} facultyName - The optional name of the faculty to filter by.
 */
async function _buildGetLimitedWhereClause(facultyName) {
  const where = { project: { is: null } };

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
  where: { uuidAuthor: outsiderId },
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
