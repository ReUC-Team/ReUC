import { getTableNames } from "./getTableNames.js";
import { getTableSchema } from "./getTableSchema.js";
import { getLimitedTableRecords } from "./getLimitedTableRecords.js";

/**
 * The 'admin' entity in the application layer, grouping all use cases
 * for administrative panel functionality.
 */
const admin = {
  getTableNames,
  getTableSchema,
  getLimitedTableRecords,
};

export default admin;
