/**
 * @class ApplicationError
 * @description Base class for all custom errors in the application layer.
 * This allows the presentation layer to have a single catch-all for errors
 * originating from application-level logic (e.g., input sanitization)
 * by checking `instanceof ApplicationError`. It ensures a clear separation
 * from domain-level or infrastructure-level exceptions.
 */
export class ApplicationError extends Error {
  /**
   * @param {string} message - A human-readable description of the error.
   * @param {object} [options] - Additional options.
   * @param {string} [options.errorCode] - A unique code for this error type.
   * @param {Error} [options.cause] - The original error that caused this one.
   * @param {object} [options.details] - Additional structured data about the error.
   */
  constructor(
    message = "An unexpected application error occurred.",
    options = {}
  ) {
    super(message, { cause: options.cause });

    this.name = this.constructor.name;
    this.errorCode = options.errorCode || "APPLICATION_ERROR_UNKNOWN";
    this.details = options.details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
