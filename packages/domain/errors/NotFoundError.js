import DomainError from "./DomainError.js";

/**
 * @class NotFoundError
 * @description Thrown when a requested entity or resource is not found.
 */
export default class NotFoundError extends DomainError {
  constructor(message = "The requested resource was not found.", options = {}) {
    super(message, { ...options, errorCode: "NOT_FOUND" });
  }
}
