import InfrastructureError from "./InfrastructureError.js";

/**
 * @class NotFoundError
 * @description Thrown when a query targets a specific resource that does not exist.
 * Typically corresponds to Prisma error P2025.
 */
export default class NotFoundError extends InfrastructureError {
  constructor(message = "The requested resource was not found.", options = {}) {
    super(message, { ...options, errorCode: "RESOURCE_NOT_FOUND" });
  }
}
