import FileStorageError from "./FileStorageError.js";

/**
 * @class ValidationError
 * @description Thrown when a file fails validation checks, such as for
 * mimetype or size. This typically corresponds to a client-side error.
 */
export default class ValidationError extends FileStorageError {
  constructor(message = "File validation failed.", options = {}) {
    super(message, { ...options, errorCode: "STORAGE_RULE_NOT_FOUND" });
  }
}
