import { TeamMember } from "./TeamMember.js";
import * as DomainError from "../errors/index.js";
import { teamMemberRepo } from "@reuc/infrastructure/teamMemberRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Updates a member role.
 * @param {object} params
 * @param {string} params.uuidProject - The unique identifier UUID of the project team.
 * @param {string} params.uuidMemberUser - The unique identifier UUID of the team member user to update.
 * @param {number} params.newRoleId - The new role id of the team role.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.NotFoundError} Member is not found or is
 * deleted (race conditions between the find and update calls).
 * @throws {DomainError.BusinessRuleError} If a invalid business rule.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function updateMemberRole({
  uuidProject,
  uuidMemberUser,
  newRoleId,
}) {
  try {
    const teamMember = new TeamMember({
      uuidProject,
      uuidUser: uuidMemberUser,
      roleId: newRoleId,
    });

    const updates = teamMember.toPrimitives();

    delete updates.uuid_team_member;

    return await teamMemberRepo.updateTeamMemberRole(updates);
  } catch (err) {
    if (err instanceof InfrastructureError.ForeignKeyConstraintError) {
      const field = err.details?.field || "related resource";

      throw new DomainError.BusinessRuleError(
        `The update of the team member failed because the provided '${field}' doest not exist.`,
        { cause: err, details: err.details }
      );
    }

    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `Team member with UUID '${uuidMemberUser}'  in project with UUID '${uuidProject}' could not be found for update.`,
        {
          details: {
            resource: "teamMember",
            uuidUser: uuidMemberUser,
            uuidProject,
          },
          cause: err,
        }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The update of the member could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (createTeam):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while updating the member.",
      { cause: err }
    );
  }
}
