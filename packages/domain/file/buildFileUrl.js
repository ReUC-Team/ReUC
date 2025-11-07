/**
 * Constructs the standard URL path for a given file link object.
 * This is a business rule that enforces a file URL structure.
 *
 * @param {object} link - The file link data object
 * @param {string} link.modelTarget - The model type (e.g., "APPLICATION")
 * @param {string} link.purpose - The file purpose (e.g., "BANNER", "ATTACHMENT", "CV")
 * @param {string} link.uuidTarget - The UUID of the target entity
 *
 * @returns {string|null} The formatted URL path, or null if invalid input.
 */
export function buildFileUrl(link) {
  if (!link || !link.modelTarget || !link.purpose || !link.uuidTarget) {
    return null;
  }

  return `/file/${link.modelTarget}/${link.purpose}/${link.uuidTarget}`;
}
