import * as DomainError from "../errors/index.js";
import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves a detailed application.
 * @param {string} applicationUuid
 *
 * @throws {DomainError.NotFoundError} If the application is not found.
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function getDetailedApplication(applicationUuid) {
  try {
    const application = await applicationRepo.getDetailedApplication(
      applicationUuid
    );

    if (!application)
      throw new DomainError.NotFoundError(
        `Application with UUID ${applicationUuid} could not be found.`,
        { details: { resource: "application", identifier: applicationUuid } }
      );

    return application;
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the application could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getDetailedApplication):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching the application.",
      { cause: err }
    );
  }
}
