import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { startProject as startProjectDomain } from "@reuc/domain/project/startProject.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Orchestrates the approval of an application.
 *
 * @param {string} uuidProject - The UUID of the project to rollback.
 * @param {string} uuidRequestingUser - The UUID of the professor requesting the start.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.NotFoundError} If any resource is not found during transaction.
 * @throws {ApplicationError.AuthorizationError}
 * @throws {ApplicationError.ConflictError} if the application is already approved
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function start(uuidProject, uuidRequestingUser) {
  const allErrors = validateUuid(uuidProject, "uuidProject");
  if (allErrors.length > 0)
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });

  try {
    const project = await startProjectDomain(uuidProject, uuidRequestingUser);

    return { project };
  } catch (err) {
    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError(
        "The project data is invalid.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { cause: err }
      );

    if (err instanceof DomainError.AuthorizationError)
      throw new ApplicationError.AuthorizationError(
        "User not authorizate to perform this action."
      );

    if (err instanceof ApplicationError.ApplicationError) throw err;

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Project Error (project.start):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while creating the project.",
      { cause: err }
    );
  }
}
