import { db, tableNames, tableSchemas, isPrismaError } from "./db/client.js";
import NotFoundError from "./errors/NotFoundError.js";
import DatabaseError from "./errors/DatabaseError.js";
import InfrastructureError from "./errors/InfrastructureError.js";

export const adminRepo = {
  /**
   * Returns a list of all known database table names.
   * @returns {string[]}
   */
  getAllTableNames() {
    return Object.values(tableNames);
  },
  /**
   * Retrieves the schema for a given table name.
   * @param {string} table - The name of the database table.
   *
   * @returns {object} The schema object.
   * @throws {NotFoundError} If the table with the given name is not found.
   */
  getTableSchema(table) {
    const model = _getModelNameFromTableName(table);

    return tableSchemas[model];
  },
  /**
   * Get statistics for a given table, such as total items and date range.
   *
   * @param {string} table - The name of the database table for which to get stats (e.g., 'users', 'files').
   * @param {object} [query={}] - A filter object to apply before aggregating the data. This typically corresponds to a database 'where' clause (e.g., `{ status: 'ACTIVE' }`).
   *
   * @returns {Promise<{totalItems: number, dateRange?: {min: Date, max: Date}}>} A promise that resolves to an object containing the table statistics.
   * @throws {NotFoundError} If the table with the given name is not found.
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getTableRecordsStats(table, query = {}) {
    try {
      const model = _getModelNameFromTableName(table);
      const schema = tableSchemas[model];
      const aggregateConfig = _buildAggregateConfig(schema, query);

      const stats = await db[model].aggregate(aggregateConfig);

      const result = { totalItems: stats._count._all };

      if (stats._min?.createdAt && stats._max?.createdAt) {
        result.dateRange = {
          min: stats._min.createdAt,
          max: stats._max.createdAt,
        };
      }

      return result;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;

      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying table stats: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (adminRepo.getTableRecordsStats) for TABLE ${table}:`,
        err
      );
      throw new InfrastructureError(
        `Unexpected Infrastructure error while querying table stats`,
        { cause: err }
      );
    }
  },
  /**
   * Get a paginated list of records from a given table.
   *
   * @param {string} table - The name of the database table to query (e.g., 'users', 'files').
   * @param {object} options - The configuration object for the query.
   * @param {object} [options.query={}] - A filter object to apply to the records, similar to a 'where' clause. Defaults to an empty object (no filter).
   * @param {object} [options.sort={createdAt: 'desc'}] - An object specifying the sort order (e.g., `{ name: 'asc' }`). Defaults to sorting by creation date in descending order.
   * @param {number} [options.page=1] - The page number to retrieve for pagination. Defaults to `1`.
   * @param {number} [options.perPage=50] - The number of records to return per page. Defaults to `50`.
   *
   * @returns {Promise<Array<object>>} A promise that resolves to an array of records from the specified table.
   * @throws {NotFoundError} If the table with the given name is not found.
   * @throws {DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError} For other unexpected errors.
   */
  async getLimitedTableRecords(
    table,
    { query = {}, sort = { createdAt: "desc" }, page = 1, perPage = 50 }
  ) {
    try {
      const model = _getModelNameFromTableName(table);
      const skip = (page - 1) * perPage;

      return await db[model].findMany({
        where: query,
        orderBy: sort,
        skip,
        take: perPage,
      });
    } catch (err) {
      if (err instanceof NotFoundError) throw err;

      if (isPrismaError(err))
        throw new DatabaseError(
          `Unexpected database error while querying table stats: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (adminRepo.getLimitedTableRecords) for TABLE ${table}:`,
        err
      );
      throw new InfrastructureError(
        `Unexpected Infrastructure error while querying table records`,
        { cause: err }
      );
    }
  },
};

/**
 * A private helper to get the Prisma model name (e.g., "user") from a
 * database table name (e.g., "Users").
 * @param {string} table - The name of the database table.
 *
 * @returns {string} The corresponding Prisma model name.
 * @throws {NotFoundError} If the table name is not found in the mapping.
 */
function _getModelNameFromTableName(table) {
  const tables = Object.values(tableNames);
  const modelIndex = tables.indexOf(table);

  if (modelIndex === -1)
    throw new NotFoundError(`No model found for table name: ${table}`, {
      details: { message: `No table was found.` },
    });

  const models = Object.keys(tableNames);
  return models[modelIndex];
}

/**
 * A private helper to build the configuration object for a Prisma aggregate query.
 * @param {object} modelSchema - The schema object for the model.
 * @param {object} query - The where clause for the query.
 *
 * @returns {object} The configuration object for Prisma's aggregate method.
 */
function _buildAggregateConfig(modelSchema, query) {
  const aggregateConfig = {
    _count: { _all: true },
    where: query,
  };

  if (modelSchema && "createdAt" in modelSchema) {
    aggregateConfig._min = { createdAt: true };
    aggregateConfig._max = { createdAt: true };
  }

  return aggregateConfig;
}
