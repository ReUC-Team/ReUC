import { db, isPrismaError } from "./db/client.js";
import DatabaseError from "./errors/DatabaseError.js";
import InfrastructureError from "./errors/InfrastructureError.js";

export const projectTypeRepo = {
  /**
   * Retrieves all project types.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getAll() {
    try {
      return await db.project_Type.findMany({
        select: {
          project_type_id: true,
          name: true,
          minEstimatedMonths: true,
          maxEstimatedMonths: true,
          requiredHours: true,
          roleConstraints: {
            select: {
              teamRole: {
                select: {
                  team_role_id: true,
                  name: true,
                },
              },
              minCount: true,
              maxCount: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying projectTypes: ${err.message}`,
          { cause: err }
        );

      console.error(`Infrastructure error (projectTypeRepo.getAll): ${err}`);
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying projectTypes",
        { cause: err }
      );
    }
  },
  /**
   * Finds multiple project types by their IDs.
   * @param {Array<number>} ids - An array of project type IDs.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async findByIds(ids) {
    try {
      return await db.project_Type.findMany({
        where: { project_type_id: { in: ids } },
        select: { project_type_id: true },
        orderBy: { name: "asc" },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying projectTypes: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (projectTypeRepo.findByIds) with IDs ${ids}: ${err}`
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying projectTypes",
        { cause: err }
      );
    }
  },
};
