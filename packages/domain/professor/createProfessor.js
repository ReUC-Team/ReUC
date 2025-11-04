import { Professor } from "./Professor.js";
import * as DomainError from "../errors/index.js";
import { professorRepo } from "@reuc/infrastructure/professorRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Creates a new professor.
 * @param {string} uuidUser - The UUID of the associated user.
 * @param {string} universityId - The professor's university ID.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.ConflictError} If a professor with the same user UUID already exists.
 * @throws {DomainError.DomainError} For other unexpected domain or persistence errors.
 */
export async function createProfessor(uuidUser, universityId) {
  try {
    const newProfessor = new Professor({ uuidUser, universityId });

    return await professorRepo.save(newProfessor.toPrimitives());
  } catch (err) {
    if (err instanceof InfrastructureError.UniqueConstraintError) {
      const field = err.details?.field || "resource";

      throw new DomainError.ConflictError(
        `A professor with this ${field} already exists.`,
        { details: err.details, cause: err }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The creation of a new professor could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (createProfessor):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while creating the professor.",
      { cause: err }
    );
  }
}
