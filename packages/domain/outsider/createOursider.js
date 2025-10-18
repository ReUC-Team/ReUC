import { Outsider } from "./Outsider.js";
import * as DomainError from "../errors/index.js";
import { outsiderRepo } from "@reuc/infrastructure/outsiderRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Creates a new outsider role associated with a user.
 * @param {string} uuidUser - The UUID of the user.
 *
 * @throws {DomainError.ConflictError} If an outsider role already exists for this user.
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function createOutsider(uuidUser) {
  try {
    const newOutsider = new Outsider({ uuidUser });

    return await outsiderRepo.save(newOutsider.toPrimitives());
  } catch (err) {
    if (err instanceof InfrastructureError.ConflictError) {
      const field = err.details?.field || "resource";

      throw new DomainError.ConflictError(
        `An outsider with this ${field} already exists.`,
        { details: err.details, cause: err }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The creation of the outsider profile could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (createOutsider):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while creating the outsider profile.",
      { cause: err }
    );
  }
}
