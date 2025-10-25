import InfrastructureError from "./InfrastructureError.js";

/**
 * @class ForeignKeyConstraintError
 * @description Thrown when a CREATE or UPDATE violates a foreign key constraint (referenced entity not found). Prisma P2003.
 */
export default class ForeignKeyConstraintError extends InfrastructureError {
  constructor(message = "Foreign key constraint violation.", options = {}) {
    super(message, { ...options, errorCode: "FOREIGN_KEY_VIOLATION" });
  }
}
