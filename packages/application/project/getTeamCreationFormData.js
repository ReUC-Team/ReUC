import * as ApplicationError from "../errors/index.js";
import * as DomainError from "@reuc/domain/errors/index.js";
import { getProjectConstraints } from "@reuc/domain/project/getProjectConstraints.js";
import { getAllTeamRoles } from "@reuc/domain/teamRole/getAllTeamRoles.js";

/**
 * Retrieves all metadata required to populate the "Create Team" form.
 * @param {string} uuidProject - The UUID of the project.
 *
 * @throws {ApplicationError.NotFoundError} If the project is not found.
 * @throws {ApplicationError.ApplicationError} For any unexpected errors.
 */
export async function getTeamCreationFormData(uuidProject) {
  try {
    const [constraints, allRoles] = await Promise.all([
      getProjectConstraints(uuidProject),
      getAllTeamRoles(),
    ]);

    const roleMap = new Map(
      allRoles.map((role) => [role.team_role_id, role.name])
    );

    const allowedRoles = constraints.map((constraint) => ({
      teamRoleId: constraint.teamRoleId,
      name: roleMap.get(constraint.teamRoleId) || "Unknown Role",
      minCount: constraint.minCount,
      maxCount: constraint.maxCount,
    }));

    return {
      metadata: {
        allowedRoles,
      },
    };
  } catch (err) {
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { cause: err, details: err.details }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (project.getTeamCreationFormData):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while gettinh team metadata.",
      { cause: err }
    );
  }
}
