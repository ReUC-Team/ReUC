import * as DomainError from "../errors/index.js";
import { adminRepo } from "@reuc/infrastructure/adminRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Fetches records from a table with pagination and metadata.
 *
 * @param {string} table - The name of the database table to query (e.g., 'users', 'files').
 * @param {object} [options] - The options for fetching records.
 * @param {number} [options.page] - The page number to retrieve for pagination.
 * @param {number} [options.perPage] - The number of records to return per page.
 * @param {object} [options.query] - A filter object to apply to the records, similar to a 'where' clause.
 * @param {object} [options.sort] - An object specifying the sort order (e.g., `{ name: 'asc' }`).
 *
 * @throws {DomainError.NotFoundError} If the specified table does not exist.
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function getLimitedTableRecords(
  table,
  { page, perPage, query, sort }
) {
  try {
    const [tableRecords, recordsStats, stats] = await Promise.all([
      adminRepo.getLimitedTableRecords(table, {
        query,
        sort,
        page,
        perPage,
      }),
      adminRepo.getTableRecordsStats(table, query),
      adminRepo.getTableRecordsStats(table),
    ]);

    const totalItems = stats.totalItems;
    const totalPages = Math.ceil(recordsStats.totalItems / perPage);

    return {
      records: tableRecords,
      metadata: {
        pagination: {
          page: Number(page),
          perPage: Number(perPage),
          totalPages,
          filteredItems: recordsStats.totalItems,
          totalItems,
        },
        query,
        sort,
      },
    };
  } catch (err) {
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `The requested resource '${table}' could not be found to fetch records from.`,
        { details: { resource: "admin", identifier: table }, cause: err }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of table records could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getLimitedTableRecords):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching table records.",
      { cause: err }
    );
  }
}
