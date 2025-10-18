import { ValidationError } from "../errors/ValidationError.js";

/**
 * Validates a table name to ensure it's a simple, safe string. This is
 * intentionally stricter than the shared string validator because it's for
 * a system identifier, not user-facing content.
 * @param {string} tableName - The name of the table to validate.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function validateTableName(tableName) {
  const errors = [];

  if (typeof tableName !== "string" || tableName.trim() === "") {
    errors.push({
      field: "table",
      rule: "missing_or_empty",
    });

    return errors;
  }

  if (!/^[A-Za-z_]+$/.test(tableName)) {
    errors.push({
      field: "table",
      rule: "invalid_characters",
    });
  }

  return errors;
}

/**
 * Validates the payload for get table schema.
 * @param {object} payload
 * @param {string} payload.table - The name of the table.
 *
 * @throws {ValidationError} If validation fails.
 */
export function validateGetSchemaPayload({ table }) {
  const allErrors = validateTableName(table);

  if (allErrors.length > 0) {
    throw new ValidationError("Input validation failed.", {
      details: allErrors,
    });
  }
}

/**
 * Validates the payload for get table records.
 * @param {object} payload
 * @param {string} payload.table - The name of the table.
 * @param {number|string} [payload.page] - The page number.
 * @param {number|string} [payload.perPage] - The number of records per page.
 * @param {object} [payload.query] - A filter object for the 'where' clause.
 * @param {object} [payload.sort] - An object specifying sort order (e.g., `{ name: 'asc' }`).
 *
 * @throws {ValidationError} If any part of the payload is invalid.
 */
export function validateGetRecordsPayload({
  table,
  page,
  perPage,
  query,
  sort,
}) {
  const allErrors = [];
  allErrors.push(...validateTableName(table));

  if (page !== undefined) {
    const pageNum = Number(page);

    if (!Number.isInteger(pageNum) || pageNum < 1) {
      allErrors.push({
        field: "page",
        rule: "invalid_format",
        expected: "positive integer",
      });
    }
  }

  if (perPage !== undefined) {
    const perPageNum = Number(perPage);

    if (!Number.isInteger(perPageNum) || perPageNum < 1) {
      allErrors.push({
        field: "perPage",
        rule: "invalid_format",
        expected: "positive integer",
      });
    }
  }

  if (query !== undefined && (typeof query !== "object" || query === null)) {
    allErrors.push({
      field: "query",
      rule: "invalid_type",
      expected: "object",
    });
  }

  if (sort !== undefined) {
    if (typeof sort !== "object" || sort === null) {
      allErrors.push({
        field: "sort",
        rule: "invalid_type",
        expected: "object",
      });
    } else {
      for (const value of Object.values(sort)) {
        const allowed = ["asc", "desc"];

        if (!allowed.includes(value)) {
          allErrors.push({
            field: "sort",
            rule: "invalid_sort_direction",
            allowed,
          });

          break;
        }
      }
    }
  }

  if (allErrors.length > 0) {
    throw new ValidationError("Invalid query parameters.", {
      details: allErrors,
    });
  }
}
