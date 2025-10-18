import { db, isPrismaError } from "./db/client.js";
import * as InfrastructureError from "./errors/index.js";

export const professorRepo = {
  /**
   * Creates a new professor role.
   * @param {object} professor The core data and related IDs
   *
   * @throws {InfrastructureError.ConflictError} If exist a constraint error (P2002).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async save(professor) {
    try {
      return await db.professor.create({
        data: professor,
        select: {
          uuid_professor: true,
          uuidUser: true,
          universityId: true,
          professorRole: { select: { professor_role_id: true, name: true } },
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2002") {
          const field = err.meta.target[0];

          throw new InfrastructureError.ConflictError(
            `A professor with this ${field} already owns the role.`,
            { details: { field } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while creating professor: ${err.message}`,
          { cause: err }
        );
      }

      console.error(
        `Infrastructure error (professorRepo.save) with DATA ${professor}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while creating professor",
        { cause: err }
      );
    }
  },
  /**
   * Finds an professor by their unique professor UUID.
   * @param {string} uuid - The professor's UUID.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async findByUuid(uuid) {
    try {
      return await db.professor.findUnique({
        where: { uuid_professor: uuid },
        select: {
          uuid_professor: true,
          uuidUser: true,
          universityId: true,
          professorRole: { select: { professor_role_id: true, name: true } },
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying professor: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (professorRepo.findByUuid) with UUID ${uuid}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while querying professor",
        { cause: err }
      );
    }
  },
};
