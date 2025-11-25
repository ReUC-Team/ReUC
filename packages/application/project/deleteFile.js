import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { deleteProjectFile } from "@reuc/domain/project/deleteProjectFile.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Deletes a file resource from a project.
 * @param {object} params
 * @param {string} params.uuidProject - The UUID of the project.
 * @param {string} params.uuidRequestingUser - The UUID of the user requesting the delete.
 * @param {string} params.uuidResource - The UUID of the resource to delete.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.NotFoundError} If the resource is not found.
 * @throws {ApplicationError.AuthorizationError} If the user is not authorized.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function deleteFile({
  uuidProject,
  uuidRequestingUser,
  uuidResource,
}) {
  const allErrors = [];

  allErrors.push(...validateUuid(uuidProject, "uuidProject"));
  allErrors.push(...validateUuid(uuidRequestingUser, "uuidRequestingUser"));
  allErrors.push(...validateUuid(uuidResource, "uuidResource"));

  if (allErrors.length > 0)
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });

  try {
    await deleteProjectFile({
      uuidProject,
      uuidRequestingUser,
      uuidResource,
    });

    return { success: true };
  } catch (err) {
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.AuthorizationError)
      throw new ApplicationError.AuthorizationError(
        "User not authorized to perform this action."
      );

    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError(
        "The resource file data is invalid.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (project.deleteFile):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while deleting the resource.",
      { cause: err }
    );
  }
}
