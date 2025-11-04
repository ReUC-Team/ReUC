import fs from "fs";
import path from "path";
import AdapterError from "../errors/AdapterError.js";
import ConfigurationError from "../errors/ConfigurationError.js";

/**
 * @class LocalAdapter
 * @description Manages file storage operations on the local disk.
 */
export class LocalAdapter {
  /**
   * @private
   * @param {object} config - The configuration object.
   * @param {string} config.basePath - The root directory for file storage.
   */
  constructor(config) {
    this.basePath = config.basePath;
  }

  /**
   * Creates and initializes an instance of the LocalAdapter.
   * @param {object} config - The configuration object.
   * @param {string} config.basePath - The root directory for file storage.
   *
   * @returns {LocalAdapter} A promise that resolves to an initialized adapter instance.
   * @throws {ConfigurationError} If the base storage directory cannot be created.
   */
  static create(config) {
    if (!config || !config.basePath)
      throw new ConfigurationError(
        "LocalAdapter requires a 'basePath' in its configuration."
      );

    const adapter = new LocalAdapter(config);

    try {
      fs.mkdirSync(adapter.basePath, { recursive: true });
    } catch (err) {
      throw new ConfigurationError(
        `Failed to create base directory at ${adapter.basePath}: ${err.message}`
      );
    }

    return adapter;
  }

  /**
   * Saves a file buffer to the specified path.
   * @param {Buffer} fileBuffer - The file content to save.
   * @param {string} storedFileName - The unique name for the stored file.
   * @param {string} [subfolder=""] - An optional subfolder to organize files.
   *
   * @returns {Promise<object>} Metadata about the saved file.
   * @throws {AdapterError} If the file cannot be written to disk.
   */
  async save(fileBuffer, storedFileName, subfolder = "") {
    const folderPath = path.join(this.basePath, subfolder);
    const filePath = path.join(folderPath, storedFileName);

    try {
      await fs.mkdirSync(folderPath, { recursive: true });
      await fs.promises.writeFile(filePath, fileBuffer);
    } catch (err) {
      throw new AdapterError(
        `Failed to write file to ${filePath}: ${err.message}`,
        { cause: err }
      );
    }

    return {
      storage: "local",
      path: filePath,
      fileName: storedFileName,
      url: null, // TODO: For public URL builder
    };
  }

  /**
   * Deletes a file from the local file system.
   * @param {string} filePath - The full path of the file to delete.
   *
   * @returns {Promise<boolean>} True if the file was deleted, false if it did not exist.
   * @throws {AdapterError} If an error occurs during deletion (other than file not found).
   */
  async delete(filePath) {
    try {
      await fs.promises.unlink(filePath);

      return true;
    } catch (err) {
      if (err.code === "ENOENT") {
        console.error(`Attempted to delete non-existent file: ${filePath}`);

        return false;
      }

      throw new AdapterError(
        `Failed to delete file at ${filePath}: ${err.message}`,
        { cause: err }
      );
    }
  }
}
