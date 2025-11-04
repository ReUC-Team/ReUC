import { Outsider } from "./Outsider.js";
import * as DomainError from "../errors/index.js";
import { outsiderRepo } from "@reuc/infrastructure/outsiderRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Updates an outsider's profile information.
 * @param {object} params
 * @param {string} params.uuidOutsider - The UUID of the outsider to update.
 * @param {object} params.body - The data to update.
 *
 * @throws {DomainError.NotFoundError} If the outsider does not exist or is
 * deleted (race conditions between the find and update calls).
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function updateOutsider({ uuidOutsider, body }) {
  try {
    const existingOutsider = await outsiderRepo.findByUuid(uuidOutsider);

    if (!existingOutsider)
      throw new DomainError.NotFoundError(
        `Outsider profile with UUID '${uuidOutsider}' could not be found`,
        { details: { resource: "outsider", identifier: uuidOutsider } }
      );

    const normalizedOutsider = new Outsider({ ...existingOutsider, ...body });
    const updates = normalizedOutsider.toPrimitives();

    delete updates.uuid_outsider;
    delete updates.uuidUser;

    if (Object.keys(updates).length === 0) return existingOutsider;

    return await outsiderRepo.update(uuidOutsider, updates);
  } catch (err) {
    // Handles race condition where outsider is deleted between find and update.
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `Outsider profile with UUID '${uuidOutsider}' could not be found for update`,
        {
          details: { resource: "outsider", identifier: uuidOutsider },
          cause: err,
        }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The update of the outsider profile could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (updateOutsider):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while updating the outsider profile.",
      { cause: err }
    );
  }
}
