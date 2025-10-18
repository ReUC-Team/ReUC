import DomainError from "./DomainError.js";

/**
 * @class ConflictError
 * @description Thrown when an operation would result in a duplicate or conflicting resource.
 */
export default class ConflictError extends DomainError {
  constructor(
    message = "A conflict occurred with an existing resource.",
    options = {}
  ) {
    super(message, { ...options, errorCode: "CONFLICT" });
  }
}
