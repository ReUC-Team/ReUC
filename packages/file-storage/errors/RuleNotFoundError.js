import FileStorageError from "./FileStorageError.js";

/**
 * @class RuleNotFoundError
 * @description Thrown when no file storage rule is found for a given model/purpose.
 * This is a runtime error indicating invalid input to the FileService.
 */
export default class RuleNotFoundError extends FileStorageError {
  constructor(message = "No matching file storage rule found.", options = {}) {
    super(message, { ...options, errorCode: "STORAGE_RULE_NOT_FOUND" });

    // this.details = details;
  }
}
