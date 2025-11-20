import * as ApplicationError from "../errors/index.js";
import { validateTeamCreationPayload } from "./validators.js";
import { createTeam as createTeamDomain } from "@reuc/domain/teamMember/createTeam.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Application layer use case for creating a new team for a project.
 * @param {object} params
 * @param {string} params.uuidProject - The UUID of the project.
 * @param {object} params.body - The request body payload.
 * @param {Array<{ uuidUser: string, roleId: number }>} params.body.members - Array of members to add.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function createTeam({ uuidProject, body }) {
  validateTeamCreationPayload(uuidProject, body);

  try {
    return await createTeamDomain({
      uuidProject,
      members: body.members,
    });
  } catch (err) {
    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError("The team data is invalid.", {
        details: err.details,
        cause: err,
      });

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Project Error (project.createTeam):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while creating the team.",
      { cause: err }
    );
  }
}
