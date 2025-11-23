import { db, isPrismaError } from "./db/client.js";
import * as InfrastructureError from "./errors/index.js";

export const projectRepo = {
  /**
   * Orchestrates the creation of a new project
   * @param {object} project - The core project data and related IDs.
   * @param {string} uuidAdvisor - The UUID of the professor creating it.
   * @param {string} roleSlug - The slug of the project member role of the professor that will be assigned to.
   *
   * @throws {InfrastructureError.UniqueConstraintError} If exist a constraint error (P2002).
   * @throws {InfrastructureError.ForeignKeyConstraintError} If exist a constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async save(project, uuidAdvisor, roleSlug) {
    try {
      // 1. Start the database transaction
      return await db.$transaction(async (tx) => {
        // Step A: Create the Project
        const newProject = await tx.project.create({
          data: {
            creator: { connect: { uuid_user: uuidAdvisor } },
            projectStatus: { connect: { slug: "project_approved" } },
            teamMembers: {
              create: {
                user: { connect: { uuid_user: uuidAdvisor } },
                role: { connect: { slug: roleSlug } },
              },
            },
            application: {
              connect: { uuid_application: project.uuidApplication },
            },
          },
          select: {
            uuid_project: true,
            uuidApplication: true,
            statusId: true,
          },
        });

        // Step B: Update the Parent Application
        await tx.application.update({
          where: { uuid_application: project.uuidApplication },
          data: {
            applicationStatus: { connect: { slug: "approved" } },
          },
        });

        return newProject;
      });
    } catch (err) {
      // 2. Translate and re-throw database errors
      if (isPrismaError(err)) {
        if (err.code === "P2002") {
          const field = err.meta.target[0];

          throw new InfrastructureError.UniqueConstraintError(
            `A project with this ${field} already is a approved.`,
            { details: { field, rule: "unique_constraint" } }
          );
        }

        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `A project with this ${field} failed to create the project.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }
        if (err.code === "P2025") {
          const message = err.meta?.cause || "Required relation not found";

          throw new InfrastructureError.NotFoundError(
            `No (${roleSlug} Role, User or Status) related relation found for project creation.`,
            { cause: err, details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while creating project: ${err.message}`,
          { cause: err }
        );
      }

      // 3. Handle any other unexpected errors
      const context = JSON.stringify({ project });
      console.error(
        `Infrastructure error (projectRepo.save) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while creating project",
        { cause: err }
      );
    }
  },
  /**
   * Retrieves a paginated list of all projects.
   * @param {object} options - The filtering and pagination options.
   * @param {number} [options.page] - The current page number for pagination.
   * @param {number} [options.perPage] - The number of items per page.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getAll({ page = 1, perPage = 50 }) {
    try {
      const sort = { createdAt: "asc" };
      const skip = (page - 1) * perPage;
      const take = perPage;

      const [projectsRaw, totalItems] = await db.$transaction([
        db.project.findMany({
          select: {
            uuid_project: true,
            uuidApplication: true,
            projectStatus: { select: { name: true, slug: true } },
            application: {
              select: {
                uuid_application: true,
                title: true,
                shortDescription: true,
              },
            },
          },
          orderBy: sort,
          skip,
          take,
        }),
        db.project.count(),
      ]);

      const totalPages = Math.ceil(totalItems / perPage);

      return {
        records: projectsRaw,
        metadata: {
          pagination: {
            page: Number(page),
            perPage: Number(perPage),
            totalPages,
            filteredItems: totalItems,
          },
          query: {},
          sort,
        },
      };
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying projects: ${err.message}`,
          { cause: err }
        );

      const context = JSON.stringify({ page, perPage });
      console.error(
        `Infrastructure error (projectRepo.getAll) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while quering projects",
        { cause: err }
      );
    }
  },
  /**
   * Retrieves a paginated list of all projects owned by a specfic user.
   * @param {object} options - The filtering and pagination options.
   * @param {string} [options.uuidUser] - The unique indentifier ID of a user to filter by.
   * @param {number} [options.page] - The current page number for pagination.
   * @param {number} [options.perPage] - The number of items per page.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getAllByUser({ uuidUser, page = 1, perPage = 50 }) {
    try {
      const where = {
        OR: [
          { application: { uuidAuthor: uuidUser } },
          { teamMembers: { some: { uuidUser } } },
        ],
      };
      const sort = { createdAt: "asc" };
      const skip = (page - 1) * perPage;
      const take = perPage;

      const [projectsRaw, totalItems] = await db.$transaction([
        db.project.findMany({
          where,
          select: {
            uuid_project: true,
            uuidApplication: true,
            projectStatus: { select: { name: true, slug: true } },
            application: {
              select: {
                uuid_application: true,
                title: true,
                shortDescription: true,
                uuidAuthor: true,
              },
            },
          },
          orderBy: sort,
          skip,
          take,
        }),
        db.project.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / perPage);

      return {
        records: projectsRaw,
        metadata: {
          pagination: {
            page: Number(page),
            perPage: Number(perPage),
            totalPages,
            filteredItems: totalItems,
          },
          query: { uuidUser },
          sort,
        },
      };
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying projects by author: ${err.message}`,
          { cause: err }
        );

      const context = JSON.stringify({ uuidUser, page, perPage });
      console.error(
        `Infrastructure error (projectRepo.getByUuidUser) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while quering projects by author",
        { cause: err }
      );
    }
  },
  /**
   * Finds ONLY the role constraints for a given project's type.
   * This is a specific query for domain validation.
   * @param {string} uuidProject - The UUID of the project.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getConstraintsForProject(uuidProject) {
    try {
      return await db.project.findUnique({
        where: { uuid_project: uuidProject },
        select: {
          application: {
            select: {
              applicationProjectType: {
                select: {
                  projectTypeId: {
                    select: {
                      minEstimatedMonths: true,
                      maxEstimatedMonths: true,
                      roleConstraints: {
                        select: {
                          projectTypeId: true,
                          teamRoleId: true,
                          minCount: true,
                          maxCount: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying project constraints: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (projectRepo.getConstraintsForProject) with UUID ${uuidProject}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while quering project constraints",
        { cause: err }
      );
    }
  },
  /**
   * Retrieves a full detailed project data and relations
   * @param {string} uuid - The UUID of the project to search for.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getDetailedProject(uuid) {
    try {
      const projectData = await db.project.findUnique({
        where: { uuid_project: uuid },
        select: {
          // --- 1. Inherited Data (Source of Truth: Application) ---
          application: {
            select: {
              uuid_application: true,
              title: true,
              shortDescription: true,
              description: true,
              deadline: true,
              createdAt: true,
              // Author Details
              author: {
                select: {
                  uuid_user: true,
                  firstName: true,
                  middleName: true,
                  lastName: true,
                  email: true,
                  professor: {
                    select: {
                      universityId: true,
                      professorRole: {
                        select: { professor_role_id: true, name: true },
                      },
                    },
                  },
                  outsider: {
                    select: {
                      organizationName: true,
                      phoneNumber: true,
                      location: true,
                    },
                  },
                },
              },
              // --- Fetch Categories from Application ---
              applicationProjectType: {
                select: {
                  projectTypeId: {
                    select: {
                      project_type_id: true,
                      name: true,
                      minEstimatedMonths: true,
                      maxEstimatedMonths: true,
                      requiredHours: true,
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
          },
          // --- 2. Project Execution Context ---
          uuid_project: true,
          uuidApplication: true,
          uuidCreator: true,
          projectStatus: { select: { name: true, slug: true } },
          createdAt: true,
          // --- 3. Related Types ---
          teamMembers: {
            select: {
              uuid_team_member: true,
              user: {
                select: {
                  uuid_user: true,
                  firstName: true,
                  middleName: true,
                  lastName: true,
                  email: true,
                  student: { select: { universityId: true } },
                  professor: { select: { universityId: true } },
                },
              },
              role: {
                select: {
                  team_role_id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return projectData;
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying project details: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (projectRepo.getDetailedProject) with UUID ${uuid}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while quering project",
        { cause: err }
      );
    }
  },
  /**
   * Updates the status of a project using the status slug.
   * @param {string} uuidProject - The UUID of the project to update.
   * @param {string} targetStatusSlug - The unique slug identifier of the new status (e.g., 'project_in_progress').
   *
   * @throws {InfrastructureError.NotFoundError} If record was not found (P2025).
   * @throws {InfrastructureError.ForeignKeyConstraintError} If exist a constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async updateStatus(uuidProject, targetStatusSlug) {
    try {
      return db.project.update({
        where: { uuid_project: uuidProject },
        data: {
          projectStatus: {
            connect: { slug: targetStatusSlug },
          },
        },
        select: {
          uuid_project: true,
          projectStatus: { select: { name: true, slug: true } },
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `A status with this ${field} failed to update on this project.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }

        if (err.code === "P2025") {
          const message = err.meta?.cause || "Record to update not found.";

          throw new InfrastructureError.NotFoundError(
            `No ${uuid} project found to update.`,
            { details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while updating project status: ${err.message}`,
          { cause: err }
        );
      }

      const context = JSON.stringify({ uuidProject, targetStatusSlug });
      console.error(
        `Infrastructure error (projectRepo.updateStatus) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while updating project status.",
        { cause: err }
      );
    }
  },
  /**
   * Get the specific data graph needed to validate if a project can start.
   * @param {string} uuidProject - The UUID of the project to search for.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getForValidation(uuidProject) {
    try {
      return await db.project.findUnique({
        where: { uuid_project: uuidProject },
        select: {
          // --- 1. Get Team Members to validate composition ---
          uuid_project: true,
          uuidCreator: true,
          teamMembers: {
            select: {
              role: {
                select: {
                  team_role_id: true,
                },
              },
            },
          },
          // --- 2. Get Deadline and Project Type ---
          application: {
            select: {
              deadline: true,
              applicationProjectType: {
                select: {
                  projectTypeId: {
                    select: {
                      // 3. Get Constraints from the Project Type
                      minEstimatedMonths: true,
                      maxEstimatedMonths: true,
                      roleConstraints: {
                        select: {
                          teamRoleId: true,
                          minCount: true,
                          maxCount: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying project for start validation: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (projectRepo.getForStartValidation) with UUID ${uuidProject}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while quering project for start validation",
        { cause: err }
      );
    }
  },
  /**
   * Rolls back a project to the application stage.
   * This is a destructive action: it deletes the Project and resets the Application status.
   * @param {string} uuidProject - The UUID of the project to rollback.
   *
   * @throws {InfrastructureError.NotFoundError} If the project does not exist.
   * @throws {InfrastructureError.ForeignKeyConstraintError} If exist a constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For unexpected database errors.
   * @throws {InfrastructureError.InfrastructureError} For generic infrastructure errors.
   */
  async rollbackProjectToApplication(uuidProject) {
    try {
      return await db.$transaction(async (tx) => {
        // 1. Find the Project to get the Application UUID
        const project = await tx.project.findUnique({
          where: { uuid_project: uuidProject },
          select: { uuidApplication: true },
        });

        if (!project) {
          throw new InfrastructureError.NotFoundError(
            `No ${uuidProject} project found for rollback.`,
            { details: { message: `No uuid_project was found.` } }
          );
        }

        // 2. Reset Application Status to 'In Review'
        await tx.application.update({
          where: { uuid_application: project.uuidApplication },
          data: {
            applicationStatus: { connect: { slug: "in_review" } },
          },
        });

        // 3. Delete the Project
        await tx.project.delete({
          where: { uuid_project: uuidProject },
        });

        return true;
      });
    } catch (err) {
      // 1. Handle Known Infrastructure Errors (re-throw)
      if (err instanceof InfrastructureError.InfrastructureError) throw err;

      // 2. Handle Prisma Errors
      if (isPrismaError(err)) {
        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `A project application with this ${field} failed for rollback to.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }

        if (err.code === "P2025") {
          const message =
            err.meta?.cause || "Related record not found during rollback.";

          throw new InfrastructureError.NotFoundError(
            `No application found for rollback to.`,
            { details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while rolling back project: ${err.message}`,
          { cause: err }
        );
      }

      // 3. Handle Unexpected Errors
      console.error(
        `Infrastructure error (projectRepo.rollbackProjectToApplication) with UUID ${uuidProject}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while rolling back project.",
        { cause: err }
      );
    }
  },
  /**
   * Updates the deadline of an application through a project entity.
   * This is treated as a Project update because the context is the Project Lifecycle.
   * @param {string} uuidProject - The UUID of the project to update.
   * @param {string|Date} newDeadline - The new date to set.
   *
   * @throws {InfrastructureError.NotFoundError} If record was not found (P2025).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async updateDeadline(uuidProject, newDeadline) {
    try {
      return db.project.update({
        where: { uuid_project: uuidProject },
        data: {
          application: {
            update: {
              deadline: newDeadline,
            },
          },
        },
        select: {
          uuid_project: true,
          application: { select: { deadline: true } },
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2025") {
          const message = err.meta?.cause || "Record to update not found.";

          throw new InfrastructureError.NotFoundError(
            `No ${uuidProject} project found to update.`,
            { details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while updating project deadline: ${err.message}`,
          { cause: err }
        );
      }

      const context = JSON.stringify({ uuidProject, newDeadline });
      console.error(
        `Infrastructure error (projectRepo.updateDeadline) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while updating project deadline.",
        { cause: err }
      );
    }
  },
};
