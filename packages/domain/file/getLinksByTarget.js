import * as DomainError from "../errors/index.js";
import { fileRepo } from "@reuc/infrastructure/fileRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all links for a unique target.
 * @param {string} targetUuid
 *
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function getLinksByTarget(targetUuid) {
  try {
    return await fileRepo.getLinksAndMetadataByTarget(targetUuid);
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the links could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getLinksByTarget):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching the links.",
      { cause: err }
    );
  }
}
