import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const STORAGE_BACKENDS = {
  LOCAL: "local",
  /**
   * TODO: Possible expansions for AWS S3
   * or any other cloud service
   * e.g. S3: "s3"
   */
};

export const STORAGE_CONFIG = {
  backend: process.env.FILE_STORAGE_BACKEND || STORAGE_BACKENDS.LOCAL,
  local: {
    basePath:
      process.env.FILE_STORAGE_PATH || path.join(__dirname, "..", "storage"),
  },
  /**
   * s3: {
   *   bucket: process.env.FILE_STORAGE_BUCKET || "reuc-files",
   *   region: process.env.FILE_STORAGE_REGION || "us-east-1",
   * }
   */
};
