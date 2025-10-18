import { LocalAdapter } from "../adapters/LocalAdapter.js";
import { processImage } from "../processors/imageProcessor.js";
import { processDocument } from "../processors/documentProcessor.js";
import { generateStoredName, sanitizeDisplayName } from "../utils/nameUtils.js";
import { getFileRule } from "../shared/ruleUtils.js";
import * as FileStorageError from "../errors/index.js";

export class FileService {
  /**
   * @param {LocalAdapter} adapter - An initialized storage adapter instance.
   */
  constructor(adapter) {
    this.adapter = adapter;
  }

  /**
   * Processes, saves a file, and returns metadata for persistence.
   *
   * @param {Buffer} buffer - The raw file buffer.
   * @param {object} options - Options for saving the file.
   * @param {string} options.originalName - The original filename.
   * @param {string} options.mimetype - The mimetype of the file.
   * @param {string} options.targetModel - The domain model this file is for (e.g., 'APPLICATION').
   * @param {string} options.purpose - The purpose of the file (e.g., 'BANNER').
   * @param {string|null} [options.uuidTarget=null] - The UUID of the target entity.
   * @param {object} [options.processorOptions={}] - Options for the file processor.
   *
   * @returns {Promise<object>} A promise that resolves to the file metadata object.
   * @throws {RuleNotFoundError} If the model/purpose combination has no defined rule.
   * @throws {ProcessingError} If the file processing fails.
   * @throws {AdapterError} If the underlying storage adapter fails to save the file.
   */
  async saveFile(
    buffer,
    {
      originalName,
      mimetype,
      targetModel,
      purpose,
      uuidTarget = null,
      processorOptions = {},
    }
  ) {
    const rule = getFileRule(targetModel, purpose);
    if (!rule)
      throw new FileStorageError.RuleNotFoundError(
        `No rule found for model="${targetModel}" with purpose="${purpose}"`,
        {
          details: {
            rule: "invalid_rule",
            message: `Invalid rule for ${targetModel} ${purpose}`,
          },
        }
      );

    const ruleKind = rule.kind;

    let processedBuffer = buffer;
    let finalMimetype = mimetype;
    let finalSize = buffer.length;

    try {
      if (ruleKind === "image") {
        const imageProcessed = await processImage(buffer, processorOptions);

        processedBuffer = imageProcessed.buffer;
        finalMimetype = imageProcessed.mimetype;
        finalSize = imageProcessed.size;
      } else if (ruleKind === "document") {
        processedBuffer = await processDocument(buffer, processorOptions);
      }
    } catch (err) {
      throw new FileStorageError.ProcessingError(
        `Failed to process ${ruleKind}: ${err.message}`,
        { cause: err }
      );
    }

    const storedName = generateStoredName(originalName || "file");
    const displayName = sanitizeDisplayName(originalName || storedName, 100);

    const stored = await this.adapter.save(processedBuffer, storedName);

    return {
      storedPath: stored.path,
      storedName: stored.fileName || storedName,
      storage: stored.storage || "local",
      originalName: displayName || null,
      mimetype: finalMimetype,
      fileSize: finalSize,
      fileKind: ruleKind,
      modelTarget: targetModel,
      uuidTarget,
      purpose,
    };
  }

  /**
   * Deletes a file from the storage adapter.
   * @param {string} storedPath - The full path of the file to delete.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if deleted, false otherwise.
   * @throws {AdapterError} If the underlying storage adapter fails to delete the file.
   */
  async deleteFile(storedPath) {
    return this.adapter.delete(storedPath);
  }
}
