import { validateUpdatePayload } from "./validators.js";
import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { updateUser } from "@reuc/domain/user/updateUser.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Updates a user's profile information.
 * It first validates the incoming data, then passes it to the domain layer.
 *
 * @param {object} params
 * @param {string} params.uuidUser - The UUID of the user to update.
 * @param {object} params.body - The data payload containing the updates.
 * @param {object} params.body.firstName
 * @param {object} params.body.middleName
 * @param {object} params.body.lastName
 *
 * @throws {ApplicationError.ValidationError} If the input data fails validation.
 * @throws {ApplicationError.NotFoundError} If the domain layer reports that the user is not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected domain errors.
 */
export async function update({ uuidUser, body }) {
  validateUuid(uuidUser, "uuidUser");
  validateUpdatePayload(body);

  try {
    const updatedUser = await updateUser({ uuidUser, body });

    return { user: updatedUser };
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

    console.error(`Application Error (user.update):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while updating the user.",
      { cause: err }
    );
  }
}
