import FileStorageError from "./FileStorageError.js";

/**
 * @class ConfigurationError
 * @description Thrown when the file-storage module is misconfigured. This can
 * happen if an unknown storage backend is selected or a required rule
 * for a file type is missing.
 */
export default class ConfigurationError extends FileStorageError {
  constructor(message = "Invalid file storage configuration.", options = {}) {
    super(message, { ...options, errorCode: "STORAGE_CONFIG_INVALID" });
  }
}
