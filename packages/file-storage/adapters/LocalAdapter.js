import fs from "fs";
import path from "path";
import { STORAGE_CONFIG } from "../constants/paths.js";

export class LocalAdapter {
  constructor() {
    this.basePath = STORAGE_CONFIG.local.basePath;

    try {
      fs.mkdirSync(this.basePath, { recursive: true });
    } catch (err) {
      throw new Error(`Failed to create directory at path: ${this.basePath}.`);
    }
  }

  /**
   * Save expects a buffer and a storedFileName.
   * subfolder can be target model or purpose to organize.
   */
  async save(fileBuffer, storedFileName, subfolder = "") {
    const folderPath = path.join(this.basePath, subfolder || "");
    fs.mkdirSync(folderPath, { recursive: true });
    const filePath = path.join(folderPath, storedFileName);
    await fs.promises.writeFile(filePath, fileBuffer);

    return {
      storage: "local",
      path: filePath,
      fileName: storedFileName,
      url: null, // TODO: For public URL builder
    };
  }

  async delete(filePath) {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code === "ENOENT") return false;
      throw err;
    }
  }
}
