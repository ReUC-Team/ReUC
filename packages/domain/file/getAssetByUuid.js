import * as DomainError from "../errors/index.js";
import { fileRepo } from "@reuc/infrastructure/fileRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves a single asset file by its UUID.
 * @param {string} uuid - The UUID of the file.
 *
 * @throws {DomainError.NotFoundError} If the file is not found or is not an asset.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getAssetByUuid(uuid) {
  try {
    const asset = await fileRepo.getAssetByUuid(uuid);

    if (!asset)
      throw new DomainError.NotFoundError(
        `Asset with UUID ${uuid} could not be found.`,
        { details: { resource: "file", identifier: uuid } }
      );

    return asset;
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the asset could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getAssetByUuid):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching the asset.",
      { cause: err }
    );
  }
}
