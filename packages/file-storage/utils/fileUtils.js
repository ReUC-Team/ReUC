import { extname } from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Returns the stored file name (UUID + ext).
 *
 * @param {string} originalName - original filename from user
 * @returns {string} Generated unique-id name
 */
export function generateStoredName(originalName) {
  const extension = extname(originalName).toLocaleLowerCase();

  return `${uuidv4()}${extension}`;
}

/**
 * Sanitize a user-provided filename for display purposes.
 *
 * - Normalizes Unicode.
 * - Removes path separators and control characters.
 * - Collapses whitespace.
 * - Requires an extension of 1–8 chars; returns "" if missing/invalid.
 * - Truncates the base so that base+extension ≤ maxLen.
 * - Returns "" on any invalid input (safe default).
 *
 * @param {string} name - original filename from user
 * @param {number} maxLen - max allowed total length
 * @returns {string} sanitized display filename, or "" if invalid
 */
export function sanitizeDisplayName(name, maxLen = 100) {
  if (!name) return "";

  const normalized = String(name).normalize("NFKC");
  const cleaned = normalized.replace(
    /(\.{2,}|[\/\\<>:\|\?\*\u0000-\u001F]+)/g,
    " "
  );
  const collapsed = cleaned.replace(/\s+/g, " ").trim();

  // Must have a valid extension of 1–8 chars
  const extMatch = collapsed.match(/(\.[^.\s]{1,8})$/);
  if (!extMatch) return "";

  // Already within limit
  if (collapsed.length <= maxLen) return collapsed;

  // Truncate base so total length ≤ maxLen
  const ext = extMatch[1];
  const base = collapsed.slice(0, collapsed.length - ext.length);
  const truncatedBase = base.slice(0, Math.max(1, maxLen - ext.length));

  return truncatedBase + ext;
}
