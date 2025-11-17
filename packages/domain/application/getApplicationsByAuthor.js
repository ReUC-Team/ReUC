import * as DomainError from "../errors/index.js";
import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all applications owned by an author.
 * @param {object} [options]
 * @param {string} [options.uuidAuthor] - The unique identifier UUID of the author.
 * @param {number} [options.page] - The page number to retrieve for pagination.
 * @param {number} [options.perPage] - The number of records to return per page.
 *
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function getApplicationsByAuthor({ uuidAuthor, page, perPage }) {
  try {
    const pageNum = Number(page) >= 1 ? Number(page) : undefined;
    const perPageNum = Number(perPage) >= 1 ? Number(perPage) : undefined;

    return await applicationRepo.getAllByAuthor({
      uuidAuthor,
      page: pageNum,
      perPage: perPageNum,
    });
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the applications could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getApplicationsByAuthor):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching applications.",
      { cause: err }
    );
  }
}
