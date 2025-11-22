import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { update as updateApplicationService } from "../applications/update.js";
import { validateProjectCreationRules } from "@reuc/domain/project/validateProjectCreationRules.js";
import { validateProjectDeadline } from "@reuc/domain/project/validateProjectDeadline.js";
import { createProject as createProjectDomain } from "@reuc/domain/project/createProject.js";
import { getProjectTypeById } from "@reuc/domain/projectType/getProjectTypeById.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Orchestrates the approval of an application.
 *
 * Workflow:
 * 1. Validate Payload Structure.
 * 2. Validate Business Rule: Extract Single Project Type ID.
 * 3. Update Application (Always runs to ensure consistency).
 * 4. Create Project (Uses the extracted Single ID).
 * @param {object} params
 * @param {string} params.uuidRequestingUser - The unique identifier UUID of the user
 * @param {object} params.body - The request body payload.
 * @param {string} params.body.uuidApplication - The UUID of the application to approve.
 * @param {string} params.body.title - The main title of the project.
 * @param {string} params.body.shortDescription - A brief, one-sentence summary.
 * @param {string} params.body.description - A detailed description of the project's problem and solution.
 * @param {string|Date} params.body.deadline - The application deadline in 'YYYY-MM-DD' format.
 * @param {string|number|Array<string|number>} [params.body.projectType] - A single ID or array of IDs for associated project types.
 * @param {string|number|Array<string|number>} [params.body.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|number|Array<string|number>} [params.body.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [params.body.problemTypeOther] - A user-defined problem type if 'other' is selected.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.NotFoundError} If the requesting user entity is not found during project creation.
 * @throws {ApplicationError.ConflictError} if the application is already approved
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function create({ uuidRequestingUser, body }) {
  // 1. Superficial Validation
  const allErrors = validateUuid(uuidRequestingUser, "uuidRequestingUser");
  if (allErrors.length > 0)
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });

  // Extract UUID for cleaner usage
  const { uuidApplication, ...applicationData } = body;

  try {
    // --- STEP 2: VALIDATE BUSINESS RULE ---
    // --- STEP 2A: VALIDATE CARDINALITY ---
    const singleProjectTypeId = validateProjectCreationRules(
      applicationData.projectType
    );

    // --- STEP 2B: FETCH PROJECT TYPE CONSTRAINTS ---
    const projectTypeData = await getProjectTypeById(singleProjectTypeId);

    // --- STEP 2C: VALIDATE DEADLINE (Time Constraints) ---
    validateProjectDeadline(applicationData.deadline, {
      minMonths: projectTypeData.minEstimatedMonths,
      maxMonths: projectTypeData.maxEstimatedMonths,
    });

    // --- STEP 3: UPDATE APPLICATION ---
    await updateApplicationService({
      uuidApplication,
      body: applicationData,
    });

    // --- STEP 4: CREATE PROJECT ---
    const newProject = await createProjectDomain({
      uuidApplication,
      projectTypeId: singleProjectTypeId,
      uuidAdvisor: uuidRequestingUser,
    });

    return { project: newProject };
  } catch (err) {
    // 1. Domain Rule Violations (from validateProjectCreationRules)
    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    // 2. Re-throw errors from the Update Service (Already ApplicationErrors)
    if (err instanceof ApplicationError.ApplicationError) throw err;

    // 3. Handle Conflicts (from createProjectDomain)
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { cause: err }
      );

    // 3.1. Handle Conflicts (from createProjectDomain)
    if (err instanceof DomainError.ConflictError)
      throw new ApplicationError.ConflictError(
        "The registration could not be completed due to a conflict with an existing resource.",
        { cause: err }
      );

    // 4. Handle Generic Domain Errors
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    // 5. Unexpected/System Errors
    console.error(`Project Error (project.create):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while creating the project.",
      { cause: err }
    );
  }
}
