import * as DomainError from "../errors/index.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Rolls back a project to the application stage.
 *
 * Action:
 * 1. Resets the linked Application status to 'In Review'.
 * 2. Deletes the Project entity (and cascades to Team Members).
 *
 * @param {string} uuidProject - The UUID of the project to rollback.
 * @param {string} uuidRequestingUser - The UUID of the professor requesting the rollback.
 *
 * @throws {DomainError.NotFoundError} If the project is not found.
 * @throws {DomainError.AuthorizationError}
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function rollbackProject(uuidProject, uuidRequestingUser) {
  try {
    // 1. Fetch Project Data
    const projectData = await projectRepo.getForValidation(uuidProject);

    if (!projectData) {
      throw new DomainError.NotFoundError(
        `Project with UUID '${uuidProject}' could not be found.`,
        { details: { resource: "project", identifier: uuidProject } }
      );
    }

    // 2. Validate Ownership
    if (projectData.uuidCreator !== uuidRequestingUser) {
      throw new DomainError.AuthorizationError(
        "Only the creator of the project can perform a rollback."
      );
    }

    return await projectRepo.rollbackProjectToApplication(uuidProject);
  } catch (err) {
    // 1. Handle Resource Not Found
    if (err instanceof InfrastructureError.NotFoundError) {
      throw new DomainError.NotFoundError(
        `Project with UUID '${uuidProject}' could not be found for rollback.`,
        {
          cause: err,
          details: { resource: "project", identifier: uuidProject },
        }
      );
    }

    // 2. Pass through existing Domain Errors
    if (err instanceof DomainError.DomainError) throw err;

    // 3. Handle System/Infra Errors
    if (err instanceof InfrastructureError.InfrastructureError) {
      throw new DomainError.DomainError(
        "The project could not be rolled back due to a system error.",
        { cause: err }
      );
    }

    // 4. Catch-all for unexpected runtime errors
    console.error(`Domain error (rollbackProject):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while rolling back the project.",
      { cause: err }
    );
  }
}
