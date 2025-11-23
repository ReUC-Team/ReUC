import * as DomainError from "../errors/index.js";
import { validateProjectDeadline } from "../project/validateProjectDeadline.js";
import { validateTeamComposition } from "../teamMember/teamCompositionService.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Transitions a project status to 'In Progress'.
 * @param {string} uuidProject — The UUID of the project to update.
 * @param {string} uuidRequestingUser - The UUID of the professor requesting the start.
 *
 * @throws {DomainError.ValidationError} If validations fails.
 * @throws {DomainError.NotFoundError} If the project is not found.
 * @throws {DomainError.BusinessRuleError} If a invalid business rule.
 * @throws {DomainError.AuthorizationError}
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function startProject(uuidProject, uuidRequestingUser) {
  try {
    const projectData = await projectRepo.getForValidation(uuidProject);
    if (!projectData) {
      throw new DomainError.NotFoundError(
        `Project with UUID '${uuidProject}' could not be found to start.`,
        { details: { resource: "project", identifier: uuidProject } }
      );
    }

    if (projectData.uuidCreator !== uuidRequestingUser) {
      throw new DomainError.AuthorizationError(
        "Only the creator of the project can perform a start."
      );
    }

    const application = projectData.application;
    if (!application.applicationProjectType?.[0]?.projectTypeId) {
      throw new DomainError.BusinessRuleError(
        `The start of project failed because no associated Project Type found to validate project business rules.`,
        {
          details: {
            rule: "missing_or_empty",
            field: "applicationProjectType",
          },
        }
      );
    }

    const projectType = application.applicationProjectType[0].projectTypeId;
    const constraints = projectType.roleConstraints;
    const teamMembers = (projectData.teamMembers || []).map((tm) => ({
      roleId: tm.role.team_role_id,
    }));

    // VALIDATION A: Team Composition
    validateTeamComposition(teamMembers, constraints);

    // VALIDATION B: Deadline Constraints
    validateProjectDeadline(application.deadline, {
      minMonths: projectType.minEstimatedMonths,
      maxMonths: projectType.maxEstimatedMonths,
    });

    return await projectRepo.updateStatus(uuidProject, "project_in_progress");
  } catch (err) {
    if (err instanceof InfrastructureError.ForeignKeyConstraintError) {
      const field = err.details?.field || "related resource";

      throw new DomainError.BusinessRuleError(
        `The start of project failed because the required '${field}' is missing in the system configuration.`,
        { cause: err, details: err.details }
      );
    }

    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `Project with UUID '${uuidProject}' could not be found to start.`,
        {
          cause: err,
          details: { resource: "project", identifier: uuidProject },
        }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The start of the project could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getDetailedProject):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while starting the project.",
      { cause: err }
    );
  }
}
