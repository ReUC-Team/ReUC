import InfrastructureError from "./InfrastructureError.js";

/**
 * @class DatabaseError
 * @description A generic wrapper for other unknown database errors, such as connection
 * issues, query timeouts, or other unexpected Prisma errors.
 */
export default class DatabaseError extends InfrastructureError {
  constructor(
    message = "An unexpected database error occurred.",
    options = {}
  ) {
    super(message, { ...options, errorCode: "DATABASE_ERROR_UNKNOWN" });
  }
}
