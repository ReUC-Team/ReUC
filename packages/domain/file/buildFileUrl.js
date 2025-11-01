/**
 * Constructs the standard URL path for a given file link object.
 * This is a business rule that enforces a file URL structure.
 *
 * @param {object} link - The file link data object
 * @param {string} link.modelTarget
 * @param {string} link.purpose
 * @param {string} link.uuidTarget
 *
 * @returns {string} The formatted URL path.
 */
export function buildFileUrl(link) {
  if (!link || !link.modelTarget || !link.purpose || !link.uuidTarget) {
    return null;
  }

  return `/${link.modelTarget}/${link.purpose}/${link.uuidTarget}`;
}
