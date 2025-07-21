import { db } from "./db/client.js";
import { projectTypeRepo } from "./projectTypeRepo.js";
import { facultyRepo } from "./facultyRepo.js";
import { problemTypeRepo } from "./problemTypeRepo.js";

export const applicationRepo = {
  async update(uuid, updates) {
    return await db.application.update({
      where: { uuid_application: uuid },
      data: { updates },
    });
  },

  async save(application) {
    const {
      applicationProjectType = [],
      applicationFaculty = [],
      applicationProblemType = [],
      ...explodedApplication
    } = application;

    const projectTypeIds =
      applicationProjectType.length > 0
        ? await projectTypeRepo.findIdsByNames(applicationProjectType)
        : [];
    const facultyIds =
      applicationFaculty.length > 0
        ? await facultyRepo.findIdsByNames(applicationFaculty)
        : [];
    const problemTypes =
      applicationProblemType.length > 0
        ? await Promise.all(
            applicationProblemType.map((pt) =>
              problemTypeRepo.findByNameOrCreate(pt)
            )
          )
        : [];

    return await db.application.create({
      data: {
        ...explodedApplication,

        ...(projectTypeIds.length > 0 && {
          applicationProjectType: {
            create: projectTypeIds.map((pt) => ({
              projectTypeId: {
                connect: { project_type_id: pt.project_type_id },
              },
            })),
          },
        }),

        ...(facultyIds.length > 0 && {
          applicationFaculty: {
            create: facultyIds.map((f) => ({
              facultyTypeId: {
                connect: { faculty_id: f.faculty_id },
              },
            })),
          },
        }),

        ...(problemTypes.length > 0 && {
          applicationProblemType: {
            create: problemTypes.map((pt) => ({
              problemTypeId: {
                connect: { problem_type_id: pt.problem_type_id },
              },
            })),
          },
        }),
      },
    });
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
