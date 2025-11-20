import * as DomainError from "../errors/index.js";
import { teamRoleRepo } from "@reuc/infrastructure/teamRoleRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all team roles from the catalog.
 *
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getAllTeamRoles() {
  try {
    return await teamRoleRepo.getAll();
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "Could not get team roles due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getAllTeamRoles):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while getting all team roles.",
      { cause: err }
    );
  }
}
