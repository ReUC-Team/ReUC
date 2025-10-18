import { db, isPrismaError } from "./db/client.js";
import DatabaseError from "./errors/DatabaseError.js";
import InfrastructureError from "./errors/InfrastructureError.js";

export const facultyRepo = {
  /**
   * Retrieves all faculties.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getAll() {
    try {
      return await db.faculty.findMany({
        select: { name: true, faculty_id: true },
        orderBy: { name: "asc" },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying faculties: ${err.message}`,
          { cause: err }
        );

      console.error(`Infrastructure error (facultyRepo.getAll):`, err);
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying faculties",
        { cause: err }
      );
    }
  },
  /**
   * Finds multiple faculties by their IDs.
   * @param {Array<number>} ids - An array of faculty IDs.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async findByIds(ids) {
    try {
      return await db.faculty.findMany({
        where: { faculty_id: { in: ids } },
        select: { faculty_id: true },
        orderBy: { name: "asc" },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying faculties: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (facultyRepo.findByIds) with IDs ${ids}:`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying faculties",
        { cause: err }
      );
    }
  },
  /**
   * Finds a unique faculty matching a name.
   * @param {string} name - The name to search for.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async findByName(name) {
    try {
      return await db.faculty.findUnique({
        where: { name },
        select: { name: true, faculty_id: true },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying faculty: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (facultyRepo.findByName) with NAME ${name}:`,
        err
      );
      throw new InfrastructureError(
        "Unexpected Infrastructure error while querying faculty",
        { cause: err }
      );
    }
  },
};
