import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { deleteMember as deleteMemberDomain } from "@reuc/domain/teamMember/deleteMember.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Application layer use case for removing a team member.
 *
 * @param {string} uuidProject - The UUID of the project.
 * @param {string} uuidMemberUser - The UUID of the user to remove (from route params).
 *
 * @throws {ApplicationError.ValidationError} If the input data fails validation.
 * @throws {ApplicationError.NotFoundError} If the domain layer reports that the team member is not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected domain errors.
 */
export async function deleteTeamMember(uuidProject, uuidMemberUser) {
  const errors = [];
  errors.push(...validateUuid(uuidProject, "uuidProject"));
  errors.push(...validateUuid(uuidMemberUser, "uuidMemberUser"));

  if (errors.length > 0) {
    throw new ApplicationError.ValidationError(
      "Invalid IDs provided for deletion.",
      {
        details: errors,
      }
    );
  }

  try {
    await deleteMemberDomain({
      uuidProject,
      uuidMemberUser,
    });

    return { success: true };
  } catch (err) {
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

    console.error(`Application Error (project.deleteTeamMember):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while removing the team member.",
      { cause: err }
    );
  }
}
