import InfrastructureError from "./InfrastructureError.js";

/**
 * @class UniqueConstraintError
 * @description Thrown when a CREATE or UPDATE violates a unique constraint (e.g., duplicate email). Prisma P2002.
 */
export default class UniqueConstraintError extends InfrastructureError {
  constructor(message = "Unique constraint violation.", options = {}) {
    super(message, { ...options, errorCode: "UNIQUE_CONSTRAINT_VIOLATION" });
  }
}
