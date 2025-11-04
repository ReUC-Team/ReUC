import * as ApplicationError from "../errors/index.js";
import { getAllTableNames } from "@reuc/domain/admin/getAllTableNames.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a list of all available table names from the domain.
 *
 * @throws {ApplicationError.ApplicationError} For any unexpected errors from the domain.
 */
export function getTableNames() {
  try {
    const tables = getAllTableNames();

    return { tables };
  } catch (err) {
    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (admin.getTableNames):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching table names.",
      { cause: err }
    );
  }
}
