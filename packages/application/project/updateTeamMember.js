import { validateMemberUpdate } from "./validators.js";
import * as ApplicationError from "../errors/index.js";
import { updateMemberRole } from "@reuc/domain/teamMember/updateMemberRole.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Update a project team member.
 * @param {string} uuidProject - The unique identifier UUID of the project team.
 * @param {string} uuidMemberUser - The unique identifier UUID of the team member user to update.
 * @param {object} body
 * @param {number} body.roleId - The new role id of the team role.
 *
 * @throws {ApplicationError.ValidationError} If the input data fails validation.
 * @throws {ApplicationError.NotFoundError} If the domain layer reports that the team member is not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected domain errors.
 */
export async function updateTeamMember(uuidProject, uuidMemberUser, body) {
  validateMemberUpdate(uuidProject, uuidMemberUser, body);

  try {
    const updatedMember = await updateMemberRole({
      uuidProject,
      uuidMemberUser,
      newRoleId: body.roleId,
    });

    return { teamMember: updatedMember };
  } catch (err) {
    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (project.updateTeamMember):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while updating the user.",
      { cause: err }
    );
  }
}
