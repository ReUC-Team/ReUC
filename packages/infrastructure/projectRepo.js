import { db, isPrismaError } from "./db/client.js";
import * as InfrastructureError from "./errors/index.js";

export const projectRepo = {
  /**
   * Orchestrates the creation of a new project
   * @param {object} project - The core project data and related IDs.
   *
   * @throws {InfrastructureError.ForeignKeyConstraintError} If exist a constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async save(project) {
    try {
      // 1. Build the main project data
      const createData = _buildProjectCreateData(project);

      // 2. Start the database transaction
      return await db.project.create({
        data: createData,
        select: {
          uuid_project: true,
          uuidApplication: true,
          title: true,
          shortDescription: true,
          description: true,
          estimatedDate: true,
        },
      });
    } catch (err) {
      // 3. Translate and re-throw database errors
      if (isPrismaError(err)) {
        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `A project with this ${field} failed to create the project.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while creating project: ${err.message}`,
          { cause: err }
        );
      }

      // 4. Handle any other unexpected errors
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
            title: true,
            shortDescription: true,
            uuidApplication: true,
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
   * @param {string} [options.uuidAuthor] - The unique indentifier ID of a user to filter by.
   * @param {number} [options.page] - The current page number for pagination.
   * @param {number} [options.perPage] - The number of items per page.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async getByUuidAuthor({ uuidAuthor, page = 1, perPage = 50 }) {
    try {
      const where = { application: { uuidAuthor } };
      const sort = { createdAt: "asc" };
      const skip = (page - 1) * perPage;
      const take = perPage;

      const [projectsRaw, totalItems] = await db.$transaction([
        db.project.findMany({
          where,
          select: {
            uuid_project: true,
            title: true,
            shortDescription: true,
            uuidApplication: true,
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
          query: { uuidAuthor },
          sort,
        },
      };
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying projects by author: ${err.message}`,
          { cause: err }
        );

      const context = JSON.stringify({ uuidAuthor, page, perPage });
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
};

/**
 * A private helper to build the data payload for creating a project.
 * @param {object} project - The raw project data from the domain layer.
 *
 * @returns {object} The formatted data object for Prisma's `create` method.
 */
function _buildProjectCreateData(project) {
  const {
    uuidApplication,
    projectProjectType = [],
    projectFaculty = [],
    projectProblemType = [],
    projectCustomProblemType = null,
    ...projectData
  } = project;

  const createData = {
    ...projectData,
    application: { connect: { uuid_application: uuidApplication } },
    projectProjectTypes: {
      create: projectProjectType.map((id) => ({
        projectType: { connect: { project_type_id: id } },
      })),
    },
    projectFaculties: {
      create: projectFaculty.map((id) => ({
        faculty: { connect: { faculty_id: id } },
      })),
    },
    projectProblemTypes: {
      create: projectProblemType.map((id) => ({
        problemType: { connect: { problem_type_id: id } },
      })),
    },
  };

  // Handle the custom problem type if it exists
  if (projectCustomProblemType) {
    createData.projectProblemTypes.create.push({
      problemType: {
        connectOrCreate: {
          where: { name: projectCustomProblemType },
          create: { name: projectCustomProblemType },
        },
      },
    });
  }

  return createData;
}
