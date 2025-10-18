import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { getOutsiderByUuid } from "@reuc/domain/outsider/getOutsiderByUuid.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves an outsider profile by its UUID.
 *
 * @param {object} params
 * @param {string} params.uuidOutsider - The unique identifier of the outsider.
 *
 * @throws {ApplicationError.ValidationError} If the data fails validation.
 * @throws {ApplicationError.NotFoundError} - If the domain layer reports that the outsider was not found.
 * @throws {ApplicationError.ApplicationError} - For other unexpected errors.
 */
export async function getByUuid({ uuidOutsider }) {
  validateUuid(uuidOutsider, "uuidOutsider");

  try {
    const outsider = await getOutsiderByUuid({ uuidOutsider });

    return { outsider };
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

    console.error(`Application Error (outsider.getByUuid):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected server error occurred while fetching the outsider profile.",
      { cause: err }
    );
  }
}
