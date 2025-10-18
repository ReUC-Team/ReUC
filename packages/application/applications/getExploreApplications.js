import * as ApplicationError from "../errors/index.js";
import { validateExploreQuery } from "./validators.js";
import { getApplicationsByFaculty } from "@reuc/domain/application/getApplicationsByFaculty.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a paginated list of applications for the "Explore" page,
 * optionally filtered by faculty.
 *
 * @param {object} params
 * @param {string} [params.faculty] - The faculty name to filter by.
 * @param {number} [params.page] - The page number for pagination.
 * @param {number} [params.perPage] - The number of items per page.
 *
 * @throws {ApplicationError.ValidationError} If query parameters are invalid.
 * @throws {ApplicationError.ApplicationError} For any unexpected errors.
 */
export async function getExploreApplications({ faculty, page, perPage }) {
  validateExploreQuery({ faculty, page, perPage });

  try {
    const applications = await getApplicationsByFaculty({
      faculty,
      page,
      perPage,
    });

    return { applications };
  } catch (err) {
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(
      `Application Error (application.getExploreApplications):`,
      err
    );
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching applications.",
      { cause: err }
    );
  }
}
