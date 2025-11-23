import * as DomainError from "../errors/index.js";
import { validateProjectDeadline } from "../project/validateProjectDeadline.js";
import { validateTeamComposition } from "../teamMember/teamCompositionService.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Updates the deadline of a project.
 * Validates that the new date adheres to the Project Type constraints (min/max months).
 * @param {string} uuidProject — The UUID of the project to update.
 * @param {string|Date} newDeadline - The new date string (YYYY-MM-DD).
 *
 * @throws {DomainError.ValidationError} If validations fails.
 * @throws {DomainError.NotFoundError} If the project is not found.
 * @throws {DomainError.BusinessRuleError} If the date violates time constraints.
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function updateDeadline(uuidProject, newDeadline) {
  try {
    const deadline = new Date(newDeadline);
    if (isNaN(deadline.getTime()))
      throw new DomainError.ValidationError("Deadline must be a valid date.", {
        details: {
          field: "deadline",
          rule: "invalid_format",
          expected: "YYYY-MM-DD",
        },
      });

    const projectData = await projectRepo.getForValidation(uuidProject);
    if (!projectData) {
      throw new DomainError.NotFoundError(
        `Project with UUID '${uuidProject}' could not be found to update.`,
        { details: { resource: "project", identifier: uuidProject } }
      );
    }

    const application = projectData.application;
    if (!application.applicationProjectType?.[0]?.projectTypeId) {
      throw new DomainError.BusinessRuleError(
        `The update of project failed because no associated Project Type found to validate project business rules.`,
        {
          details: {
            rule: "missing_or_empty",
            field: "applicationProjectType",
          },
        }
      );
    }

    const projectType = application.applicationProjectType[0].projectTypeId;

    validateProjectDeadline(deadline, {
      minMonths: projectType.minEstimatedMonths,
      maxMonths: projectType.maxEstimatedMonths,
    });

    return await projectRepo.updateDeadline(uuidProject, deadline);
  } catch (err) {
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `Project with UUID '${uuidProject}' could not be found to update.`,
        {
          cause: err,
          details: { resource: "project", identifier: uuidProject },
        }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The update of the project could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (updateDeadline):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while updating the project.",
      { cause: err }
    );
  }
}
