import * as DomainError from "../errors/index.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all projects.
 * @param {object} [options]
 * @param {number} [options.page] - The page number to retrieve for pagination.
 * @param {number} [options.perPage] - The number of records to return per page.
 *
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function getProjects({ page, perPage }) {
  try {
    const pageNum = Number(page) >= 1 ? Number(page) : undefined;
    const perPageNum = Number(perPage) >= 1 ? Number(perPage) : undefined;

    return await projectRepo.getAll({
      page: pageNum,
      perPage: perPageNum,
    });
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the projects could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getProjects):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching projects.",
      { cause: err }
    );
  }
}
