import * as DomainError from "../errors/index.js";
import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Soft deletes an application if it is not yet approved as a project.
 *
 * Action:
 * 1. Checks if the application exists.
 * 2. Validates that the application is not already a Project.
 * 3. Validates ownership (author).
 * 4. Performs soft delete.
 *
 * @param {object} params
 * @param {string} params.uuidApplication - The UUID of the application.
 * @param {string} params.uuidAuthor - The UUID of the author.
 *
 * @throws {DomainError.NotFoundError} If the application is not found.
 * @throws {DomainError.ConflictError} If the application is already a project.
 * @throws {DomainError.AuthorizationError} If the user is not the author.
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function deleteApplication({ uuidApplication, uuidAuthor }) {
  try {
    const applicationData = await applicationRepo.getByUuid(uuidApplication);

    if (!applicationData) {
      throw new DomainError.NotFoundError(
        `Application with UUID '${uuidApplication}' could not be found.`,
        { details: { resource: "application", identifier: uuidApplication } }
      );
    }

    if (applicationData.project?.uuid_project) {
      throw new DomainError.ConflictError(
        "Application is already approved and converted to a project; cannot delete."
      );
    }

    if (applicationData.uuidAuthor !== uuidAuthor) {
      throw new DomainError.AuthorizationError(
        "Only the author of the application can perform a delete."
      );
    }

    return await applicationRepo.softDelete(uuidApplication);
  } catch (err) {
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `Application with UUID '${uuidApplication}' could not be found for delete.`,
        {
          cause: err,
          details: { resource: "application", identifier: uuidApplication },
        }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError) {
      throw new DomainError.DomainError(
        "The application could not be deleted due to a system error.",
        { cause: err }
      );
    }

    console.error(`Domain error (deleteApplication):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while deleting the project.",
      { cause: err }
    );
  }
}
