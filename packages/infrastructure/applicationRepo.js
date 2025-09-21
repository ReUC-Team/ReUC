import { db } from "./db/client.js";
import { projectTypeRepo } from "./projectTypeRepo.js";
import { facultyRepo } from "./facultyRepo.js";
import { problemTypeRepo } from "./problemTypeRepo.js";
import { FileService } from "@reuc/file-storage/services/FileService.js";

const fileService = new FileService();

export const applicationRepo = {
  async update(uuid, updates) {
    return await db.application.update({
      where: { uuid_application: uuid },
      data: { updates },
    });
  },

  async save(application, file) {
    const {
      applicationProjectType = [],
      applicationFaculty = [],
      applicationProblemType = [],
      applicationCustomProblemType = null,
      ...explodedApplication
    } = application;

    const projectTypeIds =
      applicationProjectType.length > 0
        ? await projectTypeRepo.findById(applicationProjectType)
        : [];
    const facultyIds =
      applicationFaculty.length > 0
        ? await facultyRepo.findById(applicationFaculty)
        : [];
    const problemTypeIds =
      applicationProblemType.length > 0
        ? await problemTypeRepo.findById(applicationProblemType)
        : [];

    const projectTypeCreate =
      projectTypeIds.length > 0
        ? {
            applicationProjectType: {
              create: projectTypeIds.map((pt) => ({
                projectTypeId: {
                  connect: { project_type_id: pt.project_type_id },
                },
              })),
            },
          }
        : {};

    const facultyCreate =
      facultyIds.length > 0
        ? {
            applicationFaculty: {
              create: facultyIds.map((f) => ({
                facultyTypeId: {
                  connect: { faculty_id: f.faculty_id },
                },
              })),
            },
          }
        : {};

    const problemTypeCreate = {
      applicationProblemType: {
        create: [
          ...problemTypeIds.map((pt) => ({
            problemTypeId: {
              connect: { problem_type_id: pt.problem_type_id },
            },
          })),
          ...(applicationCustomProblemType
            ? [
                {
                  problemTypeId: {
                    connectOrCreate: {
                      where: { name: applicationCustomProblemType },
                      create: { name: applicationCustomProblemType },
                    },
                  },
                },
              ]
            : []),
        ],
      },
    };

    // 1) If custom image, upload to storage first
    let savedFileMeta = null;
    if (file.customImage && file.customImage.filePayload) {
      const { filePayload, fileDescriptor } = file.customImage;
      savedFileMeta = await fileService.saveFile(filePayload.buffer, {
        originalName: fileDescriptor.name,
        mimetype: filePayload.mimetype,
        targetModel: fileDescriptor.modelTarget,
        uuidTarget: null,
        purpose: fileDescriptor.purpose,
        processorOptions: { format: "webp", quality: 70 },
      });
    }

    // 2) Create application + file records inside a transaction
    // If a saved file exists, create File row and File_Link that points to the created application.
    // If file.defaultImage is set, create File_Link referencing the existing File.
    try {
      const createdAplication = await db.$transaction(async (tx) => {
        // Create application
        const newApplication = await tx.application.create({
          data: {
            ...explodedApplication,
            ...projectTypeCreate,
            ...facultyCreate,
            ...problemTypeCreate,
          },
        });

        // If we uploaded a new file, create the File and the File_Link to the app
        if (savedFileMeta) {
          await tx.file.create({
            data: {
              storedPath: savedFileMeta.storedPath,
              storedName: savedFileMeta.storedName,
              originalName: savedFileMeta.originalName,
              mimetype: savedFileMeta.mimetype,
              fileSize: savedFileMeta.fileSize,
              fileKind: savedFileMeta.fileKind,

              File_Link: {
                create: {
                  modelTarget: savedFileMeta.modelTarget,
                  uuidTarget: newApplication.uuid_application,
                  purpose: savedFileMeta.purpose,
                },
              },
            },
          });
        }

        // If defaultImage provided, find by originalName being first created
        if (file.defaultImage) {
          const fileDescriptor = file.defaultImage;

          const existingFile = await tx.file.findFirst({
            where: {
              originalName: fileDescriptor.name,
            },
            orderBy: { createdAt: "asc" },
          });

          if (existingFile) {
            await tx.file_Link.create({
              data: {
                modelTarget: fileDescriptor.modelTarget,
                uuidTarget: newApplication.uuid_application,
                purpose: fileDescriptor.purpose,
                uuidFile: existingFile.uuid_file,
              },
            });
          }
        }

        return newApplication;
      });

      // If transaction succeeded, return the created application.
      return createdAplication;
    } catch (err) {
      // If DB transaction failed and we uploaded a file, delete it from storage
      if (savedFileMeta && savedFileMeta.storedPath) {
        try {
          await fileService.deleteFile(savedFileMeta.storedPath);
        } catch (deleteErr) {
          console.error(
            "Failed to delete stored file after DB error:",
            deleteErr
          );
        }
      }

      throw err;
    }
  },

  async getAll() {
    return await db.application.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
};

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
