import { teamMemberRepo } from "@reuc/infrastructure/teamMemberRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";
import * as DomainError from "../errors/index.js";

/**
 * Removes a member from a project team.
 * @param {object} params
 * @param {string} params.uuidProject - The UUID of the project.
 * @param {string} params.uuidMemberUser - The UUID of the member to remove.
 *
 * @throws {DomainError.NotFoundError} If the member is not found.
 * @throws {DomainError.DomainError} For unexpected errors.
 */
export async function deleteMember({ uuidProject, uuidMemberUser }) {
  try {
    /**
     * @todo Add business rule validation.
     * Example: Check if the user is the only "Project Leader" before deleting.
     * If they are the last leader, throw a BusinessRuleError preventing deletion
     * until they assign another leader.
     */

    return await teamMemberRepo.deleteTeamMember({
      uuidProject,
      uuidUser: uuidMemberUser,
    });
  } catch (err) {
    if (err instanceof InfrastructureError.NotFoundError) {
      throw new DomainError.NotFoundError(
        `Team member with UUID '${uuidMemberUser}' in project '${uuidProject}' could not be found for deletion.`,
        {
          details: {
            resource: "teamMember",
            uuidUser: uuidMemberUser,
            uuidProject,
          },
          cause: err,
        }
      );
    }

    if (err instanceof InfrastructureError.InfrastructureError) {
      throw new DomainError.DomainError(
        "The deletion of the member could not be completed due to a system error.",
        { cause: err }
      );
    }

    console.error(`Domain error (deleteMember):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while deleting the member.",
      { cause: err }
    );
  }
}
