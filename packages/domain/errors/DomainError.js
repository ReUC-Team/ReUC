/**
 * @class DomainError
 * @description Base class for all custom errors in the domain layer.
 * This allows the application layer to catch any domain-specific error
 * by checking `instanceof DomainError`.
 */
export default class DomainError extends Error {
  /**
   * @param {string} message - A human-readable description of the error.
   * @param {object} [options] - Additional options.
   * @param {string} [options.errorCode] - A unique code for this error type.
   * @param {Error} [options.cause] - The original error that caused this one.
   * @param {object} [options.details] - Additional structured data about the error.
   */
  constructor(message = "An unexpected error occurred", options = {}) {
    super(message, { cause: options.cause });

    this.name = this.constructor.name;
    this.errorCode = options.errorCode || "DOMAIN_ERROR_UNKNOWN";
    this.details = options.details;

    if (Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor);
  }
}
