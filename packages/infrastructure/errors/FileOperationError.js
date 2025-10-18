import InfrastructureError from "./InfrastructureError.js";

/**
 * @class FileOperationError
 * @description Thrown when an operation involving the file-storage module fails.
 * This error acts as a wrapper, translating a specific error from the
 * file-storage service (e.g., ProcessingError, AdapterError) into an error
 * type that belongs to the infrastructure layer. It signals a failure in
 * handling a file, such as a failed upload, processing step, or deletion.
 */
export default class FileOperationError extends InfrastructureError {
  constructor(
    message = "An error occurred during a file operation.",
    options = {}
  ) {
    super(message, { ...options, errorCode: "FILE_OPERATION_FAILED" });
  }
}
