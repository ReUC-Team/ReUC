import * as ApplicationError from "../errors/index.js";
import { validateGetSchemaPayload } from "./validators.js";
import { getTableSchema as dgts } from "@reuc/domain/admin/getTableSchema.js"; // domain getTableSchema
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves the schema for a specific table.
 *
 * @param {object} params
 * @param {string} params.table - The name of the table.
 *
 * @throws {ApplicationError.ValidationError} If the table name is invalid.
 * @throws {ApplicationError.NotFoundError} If the domain reports the table does not exist.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export function getTableSchema({ table }) {
  validateGetSchemaPayload({ table });

  try {
    const schema = dgts(table);

    return { schema };
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

    console.error(`Application Error (admin.getSchemaByTable):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching the table schema.",
      { cause: err }
    );
  }
}
