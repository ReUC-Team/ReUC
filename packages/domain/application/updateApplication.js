import { Application } from "./Application.js";
import * as DomainError from "../errors/index.js";
import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Updates an application data and relations.
 * @param {object} params
 * @param {string} params.uuidApplication - The UUID of the application to update.
 * @param {object} params.body - The payload containing updates.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.NotFoundError} User is not found or is
 * deleted (race conditions between the find and update calls).
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function updateApplication({ uuidApplication, body }) {
  try {
    const existingApplication = await applicationRepo.getByUuid(
      uuidApplication
    );
    if (!existingApplication)
      throw new DomainError.NotFoundError(
        `Application with UUID '${uuidApplication}' could not be found.`,
        { details: { resource: "application", identifier: uuidApplication } }
      );

    const applicationToUpdate = new Application({
      ...body,
      uuid_application: uuidApplication,
      uuidAuthor: existingApplication.uuidAuthor,
      applicationProjectType: body.projectType,
      applicationFaculty: body.faculty,
      applicationProblemType: body.problemType,
      applicationCustomProblemType: body.problemTypeOther,
    });
    const updates = applicationToUpdate.toPrimitives();

    delete updates.uuid_application;
    delete updates.uuidAuthor;

    if (Object.keys(updates).length === 0) return existingApplication;

    return await applicationRepo.update(uuidApplication, updates);
  } catch (err) {
    // Handles race condition where application is deleted between find and update.
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `Application with UUID '${uuidApplication}' could not be found for update.`,
        {
          details: { resource: "application", identifier: uuidApplication },
          cause: err,
        }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The update of the application could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (updateApplication):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while updating the application.",
      { cause: err }
    );
  }
}
