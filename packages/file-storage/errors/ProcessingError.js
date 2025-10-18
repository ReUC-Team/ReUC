import FileStorageError from "./FileStorageError.js";

/**
 * @class ProcessingError
 * @description Thrown when a file processing step fails, such as image
 * resizing or document conversion. This indicates a server-side problem
 * with the file manipulation logic.
 */
export default class ProcessingError extends FileStorageError {
  constructor(message = "File processing failed.", options = {}) {
    super(message, { ...options, errorCode: "FILE_PROCESSING_FAILURE" });
  }
}
