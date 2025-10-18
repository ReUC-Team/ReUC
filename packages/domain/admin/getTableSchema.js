import * as DomainError from "../errors/index.js";
import { adminRepo } from "@reuc/infrastructure/adminRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves the schema for a specific database table.
 * @param {string} table - The name of the table.
 *
 * @throws {DomainError.NotFoundError} If the specified table does not exist.
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export function getTableSchema(table) {
  try {
    return adminRepo.getTableSchema(table);
  } catch (err) {
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `The requested resource '${table}' could not be found.`,
        { details: { resource: "admin", identifier: table }, cause: err }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of table schema could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getTableSchema):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching the table schema.",
      { cause: err }
    );
  }
}
