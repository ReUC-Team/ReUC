import { createStorageAdapter } from "./storageFactory.js";
import { MODEL_FILE_RULES } from "../constants/mimetypes.js";
import { processImage } from "../processors/imageProcessor.js";
import { processDocument } from "../processors/documentProcessor.js";
import { generateStoredName, sanitizeDisplayName } from "../utils/fileUtils.js";

export class FileService {
  constructor() {
    this.adapter = createStorageAdapter();
  }

  /**
   * Save the file into storage and return a metadata object suitable for DB insertion.
   *
   * @param {Buffer} buffer
   * @param {Object} opts
   * @param {string} opts.originalName - user provided filename (display name)
   * @param {string} opts.mimetype
   * @param {string} opts.targetModel - e.g. 'APPLICATION'
   * @param {string} opts.uuidTarget - uuid of target entity (optional here)
   * @param {string} opts.purpose - e.g. 'BANNER'
   * @param {Object} opts.processorOptions - options for processors
   */
  async saveFile(
    buffer,
    {
      originalName,
      mimetype,
      targetModel,
      uuidTarget = null,
      purpose,
      processorOptions = {},
    }
  ) {
    const ruleKind = MODEL_FILE_RULES?.[targetModel]?.[purpose]?.kind;
    if (!ruleKind)
      throw Error(
        `Invalid file configuration: model='${targetModel}', purpose='${purpose}' - No file kind rule defined`
      );

    let processedBuffer = buffer;
    if (ruleKind === "image") {
      processedBuffer = await processImage(buffer, processorOptions);
    } else if (ruleKind === "document") {
      processedBuffer = await processDocument(buffer, processorOptions);
    }

    const storedName = generateStoredName(originalName || "file");
    const displayName = sanitizeDisplayName(originalName || storedName, 100);

    const stored = await this.adapter.save(processedBuffer, storedName);

    const fileKind = ruleKind;

    return {
      storedPath: stored.path,
      storedName: stored.fileName || storedName,
      storage: stored.storage || "local",
      originalName: displayName || null,
      mimetype,
      fileSize: processedBuffer.length,
      fileKind,
      modelTarget: targetModel,
      uuidTarget,
      purpose,
    };
  }

  /**
   * Delete a file
   * @param {string} storedPath
   */
  async deleteFile(storedPath) {
    return this.adapter.delete(storedPath);
  }
}
