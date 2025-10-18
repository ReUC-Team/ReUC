import { MODEL_FILE_RULES } from "../constants/mimetypes.js";

/**
 * Retrieves the file rule for a given model and purpose.
 * @param {string} model - The target model (e.g., 'APPLICATION').
 * @param {string} purpose - The file's purpose (e.g., 'BANNER').
 *
 * @returns {object|null} The rule object or null if not found.
 */
export function getFileRule(model, purpose) {
  return MODEL_FILE_RULES[model]?.[purpose] || null;
}
