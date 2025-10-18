import InfrastructureError from "./InfrastructureError.js";

/**
 * @class ConflictError
 * @description Thrown when a create or update operation violates a unique constraint.
 * Typically corresponds to Prisma error P2002.
 */
export default class ConflictError extends InfrastructureError {
  constructor(
    message = "A conflict occurred with an existing resource.",
    options = {}
  ) {
    super(message, { ...options, errorCode: "CONSTRAINT_VIOLATION_FAILURE" });
  }
}
