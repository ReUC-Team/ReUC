import { validateGetRecordsPayload } from "./validators.js";
import * as ApplicationError from "../errors/index.js";
import { getLimitedTableRecords as dgltr } from "@reuc/domain/admin/getLimitedTableRecords.js"; // domain getLimitedTableRecords
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Fetches records from a specified table with pagination, sorting, and filtering.
 * This use case validates the incoming query parameters before passing them
 * to the domain layer.
 * @param {object} params
 * @param {string} params.table - The name of the table.
 * @param {number|string} [params.page] - The page number.
 * @param {number|string} [params.perPage] - The number of records per page.
 * @param {object} [params.query] - A filter object for the 'where' clause.
 * @param {object} [params.sort] - An object specifying sort order (e.g., `{ name: 'asc' }`).
 *
 * @throws {ApplicationError.ValidationError} If query parameters are invalid.
 * @throws {ApplicationError.NotFoundError} If the domain reports the table does not exist.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function getLimitedTableRecords({
  table,
  page,
  perPage,
  query,
  sort,
}) {
  validateGetRecordsPayload({ table, page, perPage, query, sort });

  try {
    const records = await dgltr(table, { page, perPage, query, sort });

    return { records };
  } catch (err) {
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (admin.getLimitedTableRecords):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while querying table records.",
      { cause: err }
    );
  }
}
