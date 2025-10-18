import * as DomainError from "../errors/index.js";
import { outsiderRepo } from "@reuc/infrastructure/outsiderRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves an outsider by their UUID.
 * @param {object} params
 * @param {string} params.uuidOutsider - The UUID of the outsider to retrieve.
 *
 * @throws {DomainError.NotFoundError} If the outsider is not found.
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function getOutsiderByUuid({ uuidOutsider }) {
  try {
    const outsider = await outsiderRepo.findByUuid(uuidOutsider);

    if (!outsider)
      throw new DomainError.NotFoundError(
        `Outsider profile with UUID '${uuidOutsider}' could not be found.`,
        { details: { resource: "outsider", identifier: uuidOutsider } }
      );

    return outsider;
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the outsider profile could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getOutsiderByUuid):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching the outsider profile.",
      { cause: err }
    );
  }
}
