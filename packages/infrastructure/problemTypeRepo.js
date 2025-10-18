import { db, isPrismaError } from "./db/client.js";
import DatabaseError from "./errors/DatabaseError.js";
import InfrastructureError from "./errors/InfrastructureError.js";

export const problemTypeRepo = {
  /**
   * Retrieves all problem types that are predefined.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getAllPredefined() {
    try {
      return await db.problem_Type.findMany({
        where: { isPredefined: true },
        select: { problem_type_id: true, name: true },
        orderBy: { name: "asc" },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying predefined problemTypes: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (problemTypeRepo.getAllPredefined):`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying predefined problemTypes",
        { cause: err }
      );
    }
  },
  /**
   * Finds multiple problem types by their IDs.
   * @param {Array<number>} ids - An array of problem type IDs.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async findByIds(ids) {
    try {
      return await db.problem_Type.findMany({
        where: { problem_type_id: { in: ids } },
        select: { problem_type_id: true },
        orderBy: { name: "asc" },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying problemTypes: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (problemTypeRepo.findByIds) with IDs ${ids}:`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying problemTypes",
        { cause: err }
      );
    }
  },
};
