import * as DomainError from "../errors/index.js";
import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all applications no approved yet.
 * Can be filtered by faculty.
 * @param {object} [options]
 * @param {string} [options.faculty] - The faculty name to filter the retrieve.
 * @param {number} [options.page] - The page number to retrieve for pagination.
 * @param {number} [options.perPage] - The number of records to return per page.
 *
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function getApplicationsByFaculty({ faculty, page, perPage }) {
  try {
    const pageNum = Number(page) >= 1 ? Number(page) : undefined;
    const perPageNum = Number(perPage) >= 1 ? Number(perPage) : undefined;

    return await applicationRepo.getLimitedByFacultyWithoutProjectRelation({
      faculty,
      page: pageNum,
      perPage: perPageNum,
    });
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the applications could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getApplicationsByFaculty):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching applications.",
      { cause: err }
    );
  }
}
