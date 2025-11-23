import * as ApplicationError from "../errors/index.js";
import { validateUuid, validateDate } from "../shared/validators.js";
import { updateDeadline as updateDomain } from "@reuc/domain/project/updateDeadline.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Orchestrates the deadline update for a project.
 *
 * @param {object} params
 * @param {string} params.uuidProject - The UUID of the project to update.
 * @param {object} params.body
 * @param {string|Date} params.body.deadline - The new deadline in 'YYYY-MM-DD' format.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.NotFoundError} If any resource is not found during transaction.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function updateDeadline({ uuidProject, body }) {
  const allErrors = [];

  allErrors.push(...validateUuid(uuidProject, "uuidProject"));
  allErrors.push(...validateDate(body.deadline, "deadline"));

  if (allErrors.length > 0)
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });

  try {
    const project = await updateDomain(uuidProject, body.deadline);

    return {
      project: {
        uuid_project: project.uuid_project,
        deadline: project.application?.deadline,
      },
    };
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

    if (err instanceof ApplicationError.ApplicationError) throw err;

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Project Error (project.updateDeadline):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while updating the project.",
      { cause: err }
    );
  }
}
