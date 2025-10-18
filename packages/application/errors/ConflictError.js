import { ApplicationError } from "./ApplicationError.js";

/**
 * @class ConflictError
 * @description Thrown when an operation would result in a duplicate or conflicting resource
 * (e.g., trying to register an email that already exists). This is the application-layer
 * equivalent of the Domain's ConflictError.
 */
export class ConflictError extends ApplicationError {
  constructor(
    message = "A conflict occurred with an existing resource.",
    options = {}
  ) {
    super(message, { ...options, errorCode: "RESOURCE_CONFLICT" });
  }
}
