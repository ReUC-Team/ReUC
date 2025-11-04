import * as DomainError from "../errors/index.js";
import { fileRepo } from "@reuc/infrastructure/fileRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all asset files designated as application banners.
 *
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getAssetApplicationBanners() {
  try {
    return await fileRepo.getAssetApplicationBanners();
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of application banners could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getAssetApplicationBanners):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching application banners.",
      { cause: err }
    );
  }
}
