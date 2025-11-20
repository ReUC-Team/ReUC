import { db, isPrismaError } from "./db/client.js";
import DatabaseError from "./errors/DatabaseError.js";
import InfrastructureError from "./errors/InfrastructureError.js";

export const teamRoleRepo = {
  /**
   * Retrieves all team roles.
   *
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getAll() {
    try {
      return await db.team_Role.findMany({
        select: { team_role_id: true, name: true },
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
};
