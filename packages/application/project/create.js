import * as ApplicationError from "../errors/index.js";
import { validateCreationPayload } from "./validators.js";
import { createProject } from "@reuc/domain/project/createProject.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Creates a new project.
 * @param {object} params
 * @param {object} params.body - The request body payload.
 * @param {string} params.body.uuidApplication - The UUID of the application to approve.
 * @param {string} params.body.title - The main title of the project.
 * @param {string} params.body.shortDescription - A brief, one-sentence summary.
 * @param {string} params.body.description - A detailed description of the project's problem and solution.
 * @param {string|number} [params.body.estimatedEffortHours] - The project estimated hours to be complete.
 * @param {string|Date} params.body.estimatedDate - The project estimated date in 'YYYY-MM-DD' format.
 * @param {string|number|Array<string|number>} [params.body.projectType] - A single ID or array of IDs for associated project types.
 * @param {string|number|Array<string|number>} [params.body.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|number|Array<string|number>} [params.body.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [params.body.problemTypeOther] - A user-defined problem type if 'other' is selected.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.ConflictError} If a conflict occurs (e.g., invalid foreign key).
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function create({ body }) {
  // 1) Pull the application UUID out of the incoming payload — this is the primary foreign key
  const { uuidApplication, ...remainingFields } = body;
  const bodyPayload = remainingFields; // Remove uuidApplication from the body payload

  // 2) Sanitize the problemType: remove the user-selected "otro" sentinel (Spanish: "other")
  //    so validation and persistence only see real type IDs. (e.g. ["1", "otro"] -> ["1"])
  const filteredProblemType = Array.isArray(bodyPayload.problemType)
    ? bodyPayload.problemType.filter((id) => id !== "otro")
    : bodyPayload.problemType === "otro"
    ? []
    : bodyPayload.problemType;

  // 3) Prepare a temporary body for validation that substitutes the sanitized problemType.
  //    This prevents the validator from rejecting the payload due to the "otro" marker.
  const bodyForValidation = {
    ...bodyPayload,
    problemType: filteredProblemType,
  };

  // 4) Run domain-level validation with the cleaned payload and the application UUID.
  validateCreationPayload(uuidApplication, bodyForValidation);

  // 5) Build the project object to send to the domain layer. Use the original body shape
  //    but override problemType with the filtered array so only valid IDs are persisted.
  const { problemType, ...projectData } = bodyPayload;
  projectData.problemType = filteredProblemType;

  // 6) Invoke the domain create operation and return the newly created project.
  try {
    const newProject = await createProject({
      uuidApplication,
      project: projectData,
    });

    return { project: newProject };
  } catch (err) {
    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError(
        "The project data is invalid.",
        {
          details: err.details,
          cause: err,
        }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Project Error (project.create):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while creating the project.",
      { cause: err }
    );
  }
}
