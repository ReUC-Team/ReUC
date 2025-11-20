import * as DomainError from "../errors/index.js";
import { userRepo } from "@reuc/infrastructure/userRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Searches for users by a keyword (name or email).
 * @param {string} query - The search term.
 * @param {object} [options]
 * @param {number} [options.limit] - For a query limited for a fast autocomplete response
 *
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function searchUsers(query, { limit = undefined }) {
  try {
    const limitNum = Number(limit) >= 1 ? Number(limit) : undefined;

    return await userRepo.search(query, { limit: limitNum });
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The search of the user could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (searchUsers):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while searching users.",
      { cause: err }
    );
  }
}
