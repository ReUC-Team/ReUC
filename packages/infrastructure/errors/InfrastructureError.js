/**
 * @class InfrastructureError
 * @description Base class for all custom errors in the infrastructure layer.
 * This allows the application layer to catch any infrastructure-specific error
 * by checking `instanceof InfrastructureError`.
 */
export default class InfrastructureError extends Error {
  /**
   * @param {string} message - A human-readable description of the error.
   * @param {object} [options] - Additional options.
   * @param {string} [options.errorCode] - A unique code for this error type.
   * @param {Error} [options.cause] - The original error that caused this one.
   * @param {object} [options.details] - Additional structured data about the error.
   */
  constructor(message, options = {}) {
    super(message, { cause: options.cause });

    this.name = this.constructor.name;
    this.errorCode = options.errorCode || "INFRASTRUCTURE_ERROR_UNKNOWN";
    this.details = options.details;

    if (Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor);
  }
}
