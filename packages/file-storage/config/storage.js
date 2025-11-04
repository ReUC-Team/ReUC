import path from "path";
import { fileURLToPath } from "url";
import { STORAGE_BACKENDS } from "../constants/storage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

export const STORAGE_CONFIG = {
  backend: process.env.FILE_STORAGE_BACKEND || STORAGE_BACKENDS.LOCAL,
  local: {
    basePath: process.env.FILE_STORAGE_PATH || path.join(__dirname, "storage"),
  },
  /**
   * s3: {
   *   bucket: process.env.FILE_STORAGE_BUCKET || "reuc-files",
   *   region: process.env.FILE_STORAGE_REGION || "us-east-1",
   * }
   */
};
