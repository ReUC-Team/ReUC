import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZES_MB,
} from "../constants/mimetypes.js";

/**
 * Validate file size against a maximum in MB.
 * @param {Object} file - Object with a `size` property in bytes.
 * @param {string} type - The category of file to validate against. Supported values are:
 *   - "images": Allows 5MB
 *   - "documents": Allows 10MB
 * @returns {string|null} - Null if valid, otherwise error message.
 */
export function validateFileSize(file, type = "images") {
  if (!file?.size || typeof file.size !== "number") {
    return "Archivo inválido o tamaño no especificado.";
  }

  const maxMB = MAX_FILE_SIZES_MB[type] || 5;
  const sizeMB = file.size / (1024 * 1024);

  if (sizeMB > maxMB) {
    return `El archivo supera el tamaño máximo permitido de ${maxMB} MB.`;
  }

  return null;
}

/**
 * Validates the MIME type of a given file against allowed types.
 *
 * @param {Object} file - Object with a `mimetype` property of type string.
 * @param {string} type - The category of file to validate against. Supported values are:
 *   - "images": Allows ["image/jpeg", "image/png", "image/webp"]
 *   - "documents": Allows ["application/pdf"]
 * @returns {string|null} - Null if valid, otherwise error message.
 */
export function validateMimeType(file, type = "images") {
  if (!file?.mimetype || typeof file.mimetype !== "string") {
    return "Archivo inválido o MIME no especificado.";
  }

  const allowed = ALLOWED_MIME_TYPES[type] || [];
  if (!allowed.includes(file.mimetype)) {
    return `El tipo de archivo ${file.mimetype} no está permitido.`;
  }

  return null;
}

/**
 * Validates that the file contains a valid Buffer object.
 *
 * @param {Object} file - Object with a `buffer` property of type Buffer.
 * @returns {string|null} - Null if valid, otherwise error message.
 */
export function validateBuffer(file) {
  if (!file?.buffer || typeof file.buffer !== "object") {
    return "Archivo inválido o BUFFER no especificado.";
  }

  if (!Buffer.isBuffer(file.buffer)) {
    return `Formato de archivo no compatible.`;
  }

  return null;
}
