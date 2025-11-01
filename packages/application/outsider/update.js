import { validateUpdatePayload } from "./validators.js";
import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { updateOutsider } from "@reuc/domain/outsider/updateOutsider.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Update an outsider's profile.
 * It first validates the incoming data payload for correct format and types,
 * then passes the sanitized data to the domain layer for business rule validation
 * and persistence.
 *
 * @param {object} params
 * @param {string} params.uuidOutsider - The UUID of the outsider to update.
 * @param {object} params.body - The data payload containing the updates.
 * @param {string} params.body.phoneNumber
 * @param {string} params.body.location
 * @param {string} params.body.organizationName
 *
 * @throws {ApplicationError.ValidationError} If the data fails validations.
 * @throws {ApplicationError.NotFoundError} - If the domain layer reports that the outsider is not found.
 * @throws {ApplicationError.ApplicationError} - For other unexpected domain errors.
 */
export async function update({ uuidOutsider, body }) {
  validateUpdatePayload(uuidOutsider, body);

  try {
    const updatedOutsider = await updateOutsider({ uuidOutsider, body });

    return { outsider: updatedOutsider };
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

    console.error(`Application Error (outsider.update):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while updating the profile.",
      { cause: err }
    );
  }
}
