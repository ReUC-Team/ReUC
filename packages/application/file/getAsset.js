import { validateUuid } from "../shared/validators.js";
import * as ApplicationError from "../errors/index.js";
import { getAssetByUuid } from "@reuc/domain/file/getAssetByUuid.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a file asset by its UUID.
 *
 * @param {object} params
 * @param {string} params.uuidFile - The unique identifier of the file asset.
 *
 * @throws {ApplicationError.ValidationError} If the UUID is invalid.
 * @throws {ApplicationError.NotFoundError} If the domain layer reports that the asset was not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function getAsset({ uuidFile }) {
  validateUuid(uuidFile, "uuidFile");

  try {
    const assetData = await getAssetByUuid(uuidFile);

    return { file: assetData };
  } catch (err) {
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (file.getAsset):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while retrieving the file asset.",
      { cause: err }
    );
  }
}
