import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { rollbackProject as rollbackProjectDomain } from "@reuc/domain/project/rollbackProject.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Orchestrates the rollback of a project.
 *
 * @param {string} uuidProject - The UUID of the project to rollback.
 * @param {string} uuidRequestingUser - The UUID of the professor requesting the rollback.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.AuthorizationError}
 * @throws {ApplicationError.NotFoundError} If the project is not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function rollback(uuidProject, uuidRequestingUser) {
  // 1. Superficial Validation
  const allErrors = [];
  allErrors.push(...validateUuid(uuidProject, "uuidProject"));
  allErrors.push(...validateUuid(uuidRequestingUser, "uuidRequestingUser"));
  if (allErrors.length > 0)
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });

  try {
    // 2. Call Domain Logic
    await rollbackProjectDomain(uuidProject, uuidRequestingUser);

    return { success: true };
  } catch (err) {
    // 3. Error Mapping
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { cause: err }
      );

    if (err instanceof DomainError.AuthorizationError)
      throw new ApplicationError.AuthorizationError(
        "User not authorized to perform this action."
      );

    // Pass through existing ApplicationErrors
    if (err instanceof ApplicationError.ApplicationError) throw err;

    // Handle Generic Domain Errors
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The rollback could not be processed due to a server error.",
        { cause: err }
      );

    // Unexpected System Errors
    console.error(`Project Error (project.rollback):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while rolling back the project.",
      { cause: err }
    );
  }
}
