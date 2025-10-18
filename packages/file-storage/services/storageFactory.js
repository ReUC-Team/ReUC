import ConfigurationError from "../errors/ConfigurationError.js";
import { STORAGE_CONFIG } from "../config/storage.js";
import { STORAGE_BACKENDS } from "../constants/storage.js";
import { LocalAdapter } from "../adapters/LocalAdapter.js";
// import { S3Adapter } from "../adapters/S3Adapter.js";
// Possble implementation for cloud storage

/**
 * Creates an instance of a storage adapter based on the configuration.
 *
 * @returns {LocalAdapter} An instance of the configured storage adapter.
 * @throws {ConfigurationError} If the storage backend is not defined or is unknown.
 */
export function createStorageAdapter() {
  const { backend, local } = STORAGE_CONFIG;

  if (!backend) {
    throw new ConfigurationError("Storage backend is not defined.");
  }

  switch (backend) {
    case STORAGE_BACKENDS.LOCAL:
      return LocalAdapter.create(local);
    // case STORAGE_BACKENDS.S3:
    //   return async new S3Adapter(s3);
    default:
      throw new ConfigurationError(`Unknown storage backend: ${backend}`);
  }
}
