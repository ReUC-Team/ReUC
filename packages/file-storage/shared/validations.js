import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZES_MB,
} from "../constants/mimetypes.js";

/**
 * Validates that a file's size is within the allowed limit for its type.
 * @param {object} file - The file object from the request (e.g., from multer).
 * @param {number} file.size - The size of the file in bytes.
 * @param {string} fieldName - The name of the field being validated (e.g., "firstName").
 * @param {'images' | 'documents' | 'attachment_files'} type - The category of file.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function _validateFileSize(file, fieldName, type = "images") {
  const maxMB = MAX_FILE_SIZES_MB[type];
  if (!maxMB) {
    // This is a developer error, not a user error.
    throw new Error(`Invalid validation type specified: ${type}.`);
  }

  const maxSizeInBytes = maxMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return [
      {
        field: fieldName,
        rule: "max_size_exceeded",
        received: file.size,
        max: maxSizeInBytes,
      },
    ];
  }

  return [];
}

/**
 * Validates that a file's mimetype is in the allowed list for its type.
 * @param {object} file - The file object from the request.
 * @param {string} file.mimetype - The mimetype of the file.
 * @param {string} fieldName - The name of the field being validated (e.g., "firstName").
 * @param {'images' | 'documents' | 'attachment_files'} type - The category of file.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function _validateMimeType(file, fieldName, type = "images") {
  const allowed = ALLOWED_MIME_TYPES[type];
  if (!allowed) {
    // This is a developer error, not a user error.
    throw new Error(`Invalid validation type specified: ${type}.`);
  }

  if (!allowed.includes(file.mimetype)) {
    return [
      {
        field: fieldName,
        rule: "invalid_mimetype",
        received: file.mimetype,
        allowed,
      },
    ];
  }

  return [];
}

/**
 * Validates that the file object contains a valid Buffer.
 * @param {object} file - The file object from the request.
 * @param {Buffer} file.buffer - The file data as a Buffer.
 * @param {string} fieldName - The name of the field being validated (e.g., "firstName").
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function _validateBuffer(file, fieldName) {
  if (!file?.buffer || !Buffer.isBuffer(file.buffer)) {
    return [{ field: fieldName, rule: "missing_or_empty" }];
  }

  return [];
}

/**
 * A shared utility to validate a file's buffer, mimetype, and size.
 * It aggregates all errors and returns them in a machine-readable format.
 *
 * @param {object} file - The file object to validate.
 * @param {string} file.mimetype - The file mimetype.
 * @param {number} file.size - The file size.
 * @param {Buffer} file.buffer - The image buffer.
 * @param {string} [fieldName] - The name of the field being validated (e.g., "firstName").
 * @param {'images' | 'documents' | 'attachment_files'} [type] - The category of file, used to determine validation rules.
 *
 * @returns {Array<object>} An array of error objects. Returns an empty array if the file is valid.
 */
export function validateFile(file, fieldName = "file", type = "images") {
  const bufferErrors = _validateBuffer(file, fieldName);
  // If the buffer is invalid, we can't check size or mimetype, so we return early.
  if (bufferErrors.length > 0) {
    return bufferErrors;
  }

  const mimetypeErrors = _validateMimeType(file, fieldName, type);
  const sizeErrors = _validateFileSize(file, fieldName, type);

  return [...mimetypeErrors, ...sizeErrors];
}
