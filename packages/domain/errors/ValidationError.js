import DomainError from "./DomainError.js";

/**
 * @class ValidationError
 * @description Thrown when input data fails to meet business rules or format constraints.
 * It can optionally hold more specific details about the failed validations.
 */
export default class ValidationError extends DomainError {
  constructor(
    message = "One or more validation errors occurred.",
    options = {}
  ) {
    super(message, { ...options, errorCode: "VALIDATION_FAILED" });
  }
}
