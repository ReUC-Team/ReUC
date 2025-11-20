import { TeamMember } from "./TeamMember.js";
import { validateTeamComposition } from "./teamCompositionService.js";
import * as DomainError from "../errors/index.js";
import { teamMemberRepo } from "@reuc/infrastructure/teamMemberRepo.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Creates a team for a project, enforcing all business rules.
 * @param {object} params
 * @param {string} params.uuidProject - The UUID of the project.
 * @param {Array<{ uuidUser: string, roleId: number }>} params.members - Array of members to add.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.BusinessRuleError} If a invalid business rule.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function createTeam({ uuidProject, members }) {
  try {
    const teamMembers = (members || []).map(
      (member) =>
        new TeamMember({
          uuidProject: uuidProject,
          ...member,
        })
    );

    const projectData = await projectRepo.getConstraintsForProject(uuidProject);
    if (!projectData || !projectData.projectType) {
      throw new DomainError.BusinessRuleError(
        `No ${uuidProject} found or has no valid project type.`,
        { details: { field: "uuidProject", rule: "not_found" } }
      );
    }

    const constraints = projectData.projectType.roleConstraints;
    validateTeamComposition(teamMembers, constraints);

    const teamMemberPrimitives = teamMembers.map((tm) => tm.toPrimitives());
    return await teamMemberRepo.createTeam(teamMemberPrimitives);
  } catch (err) {
    if (err instanceof InfrastructureError.ForeignKeyConstraintError) {
      const field = err.details?.field || "related resource";

      throw new DomainError.BusinessRuleError(
        `The creation of the team failed because the provided '${field}' does not exist.`,
        { cause: err, details: err.details }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The creation of the team could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (createTeam):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while creating the team.",
      { cause: err }
    );
  }
}
