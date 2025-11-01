import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { getUserByUuid } from "@reuc/domain/user/getUserByUuid.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a user by their UUID.
 *
 * @param {object} params
 * @param {string} params.uuidUser - The unique identifier of the user.
 *
 * @throws {ApplicationError.ValidationError} If the UUID is not in a valid format.
 * @throws {ApplicationError.NotFoundError} If the domain layer reports that the user was not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function getByUuid({ uuidUser }) {
  const allErrors = validateUuid(uuidUser, "uuidUser");
  if (allErrors.length > 0) {
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });
  }

  try {
    const user = await getUserByUuid({ uuidUser });

    return { user };
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

    console.error(`Application Error (user.getByUuid):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected server error occurred while fetching the user.",
      { cause: err }
    );
  }
}
