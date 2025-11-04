import { db, isPrismaError } from "./db/client.js";
import * as InfrastructureError from "./errors/index.js";

export const outsiderRepo = {
  /**
   * Creates a new outsider role.
   * @param {object} outsider The core data and related IDs
   *
   * @throws {InfrastructureError.UniqueConstraintError} If exist a constraint error (P2002).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async save(outsider) {
    try {
      return await db.outsider.create({
        data: outsider,
        select: { uuid_outsider: true, uuidUser: true },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2002") {
          const field = err.meta.target[0];

          throw new InfrastructureError.UniqueConstraintError(
            `A outsider with this ${field} already owns the role.`,
            { details: { field, rule: "unique_constraint" } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while creating outsider: ${err.message}`,
          { cause: err }
        );
      }

      console.error(
        `Infrastructure error (outsiderRepo.save) with DATA ${outsider}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while creating outsider",
        { cause: err }
      );
    }
  },
  /**
   * Updates an outsider's profile.
   * @param {string} uuid - The UUID of the outsider to update.
   * @param {object} updates - The fields to update.
   *
   * @throws {InfrastructureError.NotFoundError} If record was not found (P2025).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async update(uuid, updates) {
    try {
      return await db.outsider.update({
        where: { uuid_outsider: uuid },
        data: updates,
        select: {
          uuid_outsider: true,
          uuidUser: true,
          organizationName: true,
          phoneNumber: true,
          location: true,
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2025") {
          const message = err.meta.cause;

          throw new InfrastructureError.NotFoundError(
            `No ${uuid} outsider found to update.`,
            { details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while updating outsider: ${err.message}`,
          { cause: err }
        );
      }

      console.error(
        `Infrastructure error (outsiderRepo.update) with UUID ${uuid}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while updating outsider",
        { cause: err }
      );
    }
  },
  /**
   * Finds an outsider by their unique outsider UUID.
   * @param {string} uuid - The outsider's UUID.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async findByUuid(uuid) {
    try {
      return await db.outsider.findUnique({
        where: { uuid_outsider: uuid },
        select: {
          uuidUser: true,
          uuid_outsider: true,
          location: true,
          organizationName: true,
          phoneNumber: true,
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying outsider: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (outsiderRepo.findByUuid) with UUID ${uuidUser}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while querying outsider",
        { cause: err }
      );
    }
  },
};
