import FileStorageError from "./FileStorageError.js";

/**
 * @class AdapterError
 * @description Thrown when a storage adapter (e.g., local file system, S3)
 * fails during an operation like saving or deleting a file. This is
 * typically a server-side or infrastructure issue.
 */
export default class AdapterError extends FileStorageError {
  constructor(message = "Storage adapter operation failed.", options = {}) {
    super(message, { ...options, errorCode: "STORAGE_ADAPTER_FAILURE" });
  }
}
