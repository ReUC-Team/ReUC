import { ApplicationError } from "./ApplicationError.js";

/**
 * @class ValidationError
 * @description Thrown when incoming data from the presentation layer fails
 * sanitization or format validation before being passed to the domain.
 * This is distinct from the Domain's ValidationError, which handles violations
 * of business rules.
 */
export class ValidationError extends ApplicationError {
  /**
   * @param {string} message - A general error message.
   * @param {Array<object>} [details=[]] - An array of objects detailing specific field errors.
   * @example new ValidationError("Input validation failed", [{ field: 'email', message: 'Must be a valid email format.' }])
   */
  constructor(
    message = "One or more validation errors occurred.",
    options = {}
  ) {
    super(message, { ...options, errorCode: "INPUT_VALIDATION_FAILED" });
  }
}
