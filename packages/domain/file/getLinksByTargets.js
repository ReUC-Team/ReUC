import * as DomainError from "../errors/index.js";
import { fileRepo } from "@reuc/infrastructure/fileRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves a links for a list of entities and specific purpose.
 * @param {string} modelTarget - The name of the target model (e.g., "APPLICATION").
 * @param {string} targetUuids - An array of UUIDs.
 * @param {string} purpose - The purpose of the file link (e.g., "BANNER").
 *
 * @throws {DomainError.NotFoundError} If no file link is found.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getLinksByTargets(modelTarget, targetUuids, purpose) {
  try {
    return await fileRepo.getLinksByTargets(modelTarget, targetUuids, purpose);
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the links could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getLinksByTargets):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching the links.",
      { cause: err }
    );
  }
}
