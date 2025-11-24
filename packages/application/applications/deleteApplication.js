import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { deleteApplication as deleteDomain } from "@reuc/domain/application/deleteApplication.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Orchestrates the deletion of an application.
 * @param {object} params
 * @param {string} params.uuidApplication - The UUID of the application.
 * @param {string} params.uuidAuthor - The UUID of the author.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.NotFoundError} If the domain reports the application does not exist.
 * @throws {ApplicationError.ConflictError}
 * @throws {ApplicationError.AuthorizationError} If the user does not own the application.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function deleteApplication({ uuidApplication, uuidAuthor }) {
  const allErrors = [];

  allErrors.push(...validateUuid(uuidApplication, "uuidApplication"));
  allErrors.push(...validateUuid(uuidAuthor, "uuidAuthor"));

  if (allErrors.length > 0)
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });

  try {
    await deleteDomain({ uuidApplication, uuidAuthor });

    return { success: true };
  } catch (err) {
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { cause: err }
      );

    if (err instanceof DomainError.ConflictError)
      throw new ApplicationError.ConflictError(
        "The operation could not be completed due to a conflict with an existing resource.",
        { cause: err }
      );

    if (err instanceof DomainError.AuthorizationError)
      throw new ApplicationError.AuthorizationError(
        "User not authorized to perform this action."
      );

    if (err instanceof ApplicationError.ApplicationError) throw err;

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (application.deleteApplication):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while deleting the application.",
      { cause: err }
    );
  }
}
