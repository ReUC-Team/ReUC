import { ApplicationError } from "./ApplicationError.js";

/**
 * @class NotFoundError
 * @description Thrown when a requested resource or entity cannot be found.
 * This serves as the application-level equivalent of the domain's NotFoundError,
 * ensuring the presentation layer does not need to depend on the domain.
 */
export class NotFoundError extends ApplicationError {
  constructor(message = "The requested resource was not found.", options = {}) {
    super(message, { ...options, errorCode: "RESOURCE_NOT_FOUND" });
  }
}
