import { getFileRule } from "@reuc/file-storage/shared/ruleUtils.js";

/**
 * Constructs the standard URL path for a given file link object.
 * This is a business rule that enforces a file URL structure.
 *
 * @param {object} link - The file link data object
 * @param {string} link.modelTarget - The model type (e.g., "APPLICATION")
 * @param {string} link.purpose - The file purpose (e.g., "BANNER", "ATTACHMENT", "CV")
 * @param {string} link.uuidTarget - The UUID of the target entity
 * @param {object} [link.file] - The associated file object (required for "many" cardinality)
 *
 * @returns {string|null} The formatted URL path, or null if invalid input.
 */
export function buildFileUrl(link) {
  if (!link || !link.modelTarget || !link.purpose || !link.uuidTarget) {
    return null;
  }

  // 1. Get the business rule for this file
  const rule = getFileRule(link.modelTarget, link.purpose);
  if (!rule) {
    // No rule defined for this file type
    return null;
  }

  // 2. Construct the base path
  const basePath = `/file/${link.modelTarget}/${link.purpose}/${link.uuidTarget}`;

  // 3. Handle URL structure based on cardinality
  if (rule.cardinality === "many") {
    // "many" rule (e.g., ATTACHMENT) requires the file's own UUID
    if (!link.file || !link.file.uuid_file) {
      console.error(
        `File link for ${basePath} has 'many' cardinality but is missing link.file.uuid_file`
      );

      return null;
    }

    return `${basePath}/${link.file.uuid_file}`;
  } else {
    // "one" rule (e.g., BANNER) just uses the base path
    return basePath;
  }
}
