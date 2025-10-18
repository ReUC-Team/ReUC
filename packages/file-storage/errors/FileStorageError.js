/**
 * @class FileStorageError
 * @description Base error class for all file storage module exceptions.
 *
 * @property {string} errorCode - A unique, machine-readable code for the error type.
 */
export default class FileStorageError extends Error {
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
    this.errorCode = options.errorCode || "STORAGE_ERROR_UNKNOWN";
    this.details = options.details;

    if (Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor);
  }
}
