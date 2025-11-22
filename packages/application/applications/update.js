import * as ApplicationError from "../errors/index.js";
import { validateUpdatePayload } from "./validators.js";
import { updateApplication } from "@reuc/domain/application/updateApplication.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Updates an application.
 * @param {object} params
 * @param {string} params.uuidApplication - The UUID of the application.
 * @param {object} params.body - The request body payload.
 * @param {string} params.body.title - The main title of the application.
 * @param {string} params.body.shortDescription - A brief, one-sentence summary.
 * @param {string} params.body.description - A detailed description of the application's problem and solution.
 * @param {string|Date} params.body.deadline - The application deadline in 'YYYY-MM-DD' format.
 * @param {string|number|Array<string|number>} [params.body.projectType] - A single ID or array of IDs for associated project types.
 * @param {string|number|Array<string|number>} [params.body.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|number|Array<string|number>} [params.body.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [params.body.problemTypeOther] - A user-defined problem type if 'other' is selected.
 *
 * @throws {ApplicationError.NotFoundError} If the domain reports the application does not exist.
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function update({ uuidApplication, body }) {
  const filteredProblemType = Array.isArray(body.problemType)
    ? body.problemType.filter((id) => id !== "otro")
    : body.problemType === "otro"
    ? []
    : body.problemType;

  const bodyForValidation = { ...body, problemType: filteredProblemType };

  validateUpdatePayload(uuidApplication, bodyForValidation);

  const { problemType, ...applicationData } = body;
  applicationData.problemType = filteredProblemType;

  try {
    const updatedApplication = await updateApplication({
      uuidApplication,
      body,
    });

    return { application: updatedApplication };
  } catch (err) {
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError(
        "The application data is invalid.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (application.update):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while updating the application.",
      { cause: err }
    );
  }
}
