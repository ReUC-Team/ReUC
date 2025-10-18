import { extname } from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique, URL-safe filename using a UUID and the original extension.
 * @param {string} originalName - The original filename provided by the user.
 *
 * @returns {string} The generated unique filename (e.g., 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6.pdf').
 */
export function generateStoredName(originalName) {
  const extension = extname(originalName || "").toLowerCase();

  return `${uuidv4()}${extension}`;
}

/**
 * Sanitizes a user-provided filename to make it safe for display.
 * This function normalizes unicode, removes illegal characters, collapses whitespace,
 * ensures a valid extension, and truncates the name to a maximum length.
 *
 * @param {string} name - The original filename to sanitize.
 * @param {number} [maxLen=100] - The maximum allowed total length of the sanitized name.
 *
 * @returns {string} The sanitized display filename, or an empty string if invalid.
 */
export function sanitizeDisplayName(name, maxLen = 100) {
  if (!name) return "";

  const normalized = String(name).normalize("NFKC");
  const cleaned = normalized.replace(
    /(\.{2,}|[\/\\<>:\|\?\*\u0000-\u001F]+)/g,
    " "
  );
  const collapsed = cleaned.replace(/\s+/g, " ").trim();

  const extMatch = collapsed.match(/(\.[^.\s]{1,8})$/);
  if (!extMatch) return "";

  if (collapsed.length <= maxLen) return collapsed;

  const ext = extMatch[1];
  const base = collapsed.slice(0, collapsed.length - ext.length);
  const truncatedBase = base.slice(0, Math.max(1, maxLen - ext.length));

  return truncatedBase + ext;
}
