import { STORAGE_CONFIG } from "../constants/paths.js";
import { LocalAdapter } from "../adapters/LocalAdapter.js";
// import { S3Adapter } from "../adapters/S3Adapter.js"; // Possble implementation for cloud storage

export function createStorageAdapter() {
  const backend = STORAGE_CONFIG.backend;
  const config = STORAGE_CONFIG[backend] || undefined;

  console.log("Using backen storage: ", backend, "with ", config);

  switch (backend) {
    case "local":
      return new LocalAdapter();
    // case "s3":
    //   return new S3Adapter();
    default:
      throw new Error(`Unknow storage backend: ${backend}`);
  }
}
