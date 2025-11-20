import * as ApplicationError from "../errors/index.js";
import { validatePaginationQuery } from "../shared/validators.js";
import * as DomainError from "@reuc/domain/errors/index.js";
import { searchUsers } from "@reuc/domain/user/searchUsers.js";

/**
 * Searches for user profiles by a keyword.
 * This use case orchestrates the search and formats the data
 * into a "profile" shape.
 *
 * @param {string} query - The search term (at least 3 chars).
 * @param {object} [options]
 * @param {number} [options.limit] - For a query limited for a fast autocomplete response
 *
 * @throws {ApplicationError.ValidationError} If query is invalid.
 * @throws {ApplicationError.ApplicationError} For unexpected errors.
 */
export async function searchProfiles(query, { limit = undefined }) {
  const allErrors = [];

  if (!query || typeof query !== "string" || query.trim().length < 3) {
    allErrors.push({
      field: "query",
      rule: "min_length",
      min: 3,
    });
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1) {
      allErrors.push({
        field: "limit",
        rule: "invalid_format",
        expected: "positive integer",
      });
    }
  }

  if (allErrors.length > 0) {
    throw new ApplicationError.ValidationError(
      "Invalid query parameters.",
      allErrors
    );
  }

  try {
    // 2. Call the domain use case
    const users = await searchUsers(query, { limit });

    // 3. Orchestrate/Format: Map the raw User data to a clean "Profile" shape.
    return users.map((user) => ({
      uuidUser: user.uuid_user,
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      universityId: user.student
        ? user.student.universityId
        : user.professor
        ? user.professor.universityId
        : null,
    }));
  } catch (err) {
    if (err instanceof DomainError.DomainError) {
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );
    }

    console.error(`Application error (profile.searchProfiles):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected server error occurred while searching profiles.",
      { cause: err }
    );
  }
}
