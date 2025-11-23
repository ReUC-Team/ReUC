import * as DomainError from "../errors/index.js";
import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Get application fields by ID.
 * @param {object} params
 * @param {string} params.uuidApplication - The UUID of the application to update.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.NotFoundError} User is not found or is
 * deleted (race conditions between the find and update calls).
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function getByUuid({ uuidApplication }) {
  try {
    const application = await applicationRepo.getByUuid(uuidApplication);
    if (!application)
      throw new DomainError.NotFoundError(
        `Application with UUID '${uuidApplication}' could not be found.`,
        { details: { resource: "application", identifier: uuidApplication } }
      );

    return application;
  } catch (err) {
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `Application with UUID '${uuidApplication}' could not be found.`,
        {
          details: { resource: "application", identifier: uuidApplication },
          cause: err,
        }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The query of the application could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getByUuid):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while querying the application.",
      { cause: err }
    );
  }
}
