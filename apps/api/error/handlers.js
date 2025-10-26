import { MulterError } from "multer";
import * as ApplicationError from "@reuc/application/errors/index.js";

/**
 * @file This module centralizes all specific error handling logic.
 * Each function is responsible for formatting a specific type of error
 * into the standard JSON error response body.
 */

/**
 * Formats a MulterError into a standard INPUT_VALIDATION_FAILED response.
 * @param {MulterError} err - The Multer error instance.
 * @returns {{status: number, body: object}} The HTTP status and JSON body.
 */
function handleMulterError(err) {
  let specificMessage = "A file upload error occurred.";
  const code = "INPUT_VALIDATION_FAILED";
  const message = "The provided input is invalid.";

  switch (err.code) {
    case "LIMIT_FILE_COUNT":
      specificMessage =
        "Too many files uploaded. Please check the upload limits.";
      break;
    case "LIMIT_FILE_SIZE":
      specificMessage =
        "A file is too large. Please check the file size limits.";
      break;
    case "LIMIT_UNEXPECTED_FILE":
      specificMessage = "An unexpected file field was received.";
      break;
    case "LIMIT_FIELD_KEY":
      specificMessage = "The field name is too long.";
      break;
    case "LIMIT_FIELD_VALUE":
      specificMessage = "The field value is too long.";
      break;
    case "LIMIT_FIELD_COUNT":
      specificMessage = "Too many form fields. Please check the form.";
      break;
    default:
      specificMessage = err.message;
      break;
  }

  return {
    status: 400,
    body: {
      success: false,
      error: {
        code: code,
        message: message,
        details: [
          {
            field: err.field,
            rule: err.code,
          },
        ],
      },
    },
  };
}

/**
 * Formats an ApplicationError.ValidationError.
 * @param {ApplicationError.ValidationError} err
 * @returns {{status: number, body: object}}
 */
function handleValidationError(err) {
  return {
    status: 400,
    body: {
      success: false,
      error: {
        code: err.errorCode,
        message: "The provided input is invalid.",
        details: err.details,
      },
    },
  };
}

/**
 * Formats an ApplicationError.AuthenticationError.
 * @param {ApplicationError.AuthenticationError} err
 * @returns {{status: number, body: object}}
 */
function handleAuthenticationError(err) {
  return {
    status: 401,
    body: {
      success: false,
      error: {
        code: err.errorCode,
        message:
          "Authentication failed. The request could not be authenticated.",
      },
    },
  };
}

/**
 * Formats an ApplicationError.AuthorizationError.
 * @param {ApplicationError.AuthorizationError} err
 * @returns {{status: number, body: object}}
 */
function handleAuthorizationError(err) {
  return {
    status: 403,
    body: {
      success: false,
      error: {
        code: err.errorCode,
        message:
          "Access denied. You do not have permission to perform this action.",
      },
    },
  };
}

/**
 * Formats an ApplicationError.NotFoundError.
 * @param {ApplicationError.NotFoundError} err
 * @returns {{status: number, body: object}}
 */
function handleNotFoundError(err) {
  return {
    status: 404,
    body: {
      success: false,
      error: {
        code: err.errorCode,
        message: "The requested resource could not be found.",
      },
    },
  };
}

/**
 * Formats an ApplicationError.ConflictError.
 * @param {ApplicationError.ConflictError} err
 * @returns {{status: number, body: object}}
 */
function handleConflictError(err) {
  return {
    status: 409,
    body: {
      success: false,
      error: {
        code: err.errorCode,
        message: "A conflict occurred with an existing resource.",
        details: err.details,
      },
    },
  };
}

/**
 * The default handler for any error that doesn't match a specific type.
 * @param {Error} err
 * @returns {{status: number, body: object}}
 */
export function handleDefaultError(err) {
  return {
    status: 500,
    body: {
      success: false,
      error: {
        code: err.errorCode || "INTERNAL_SERVER_ERROR",
        message: "An unexpected server error occurred.",
      },
    },
  };
}

/**
 * An ordered map of error constructors to their specific handler functions.
 * The error handler will iterate this array and use the first matching handler.
 */
export const handlerMap = [
  { constructor: MulterError, handler: handleMulterError },
  {
    constructor: ApplicationError.ValidationError,
    handler: handleValidationError,
  },
  {
    constructor: ApplicationError.AuthenticationError,
    handler: handleAuthenticationError,
  },
  {
    constructor: ApplicationError.AuthorizationError,
    handler: handleAuthorizationError,
  },
  { constructor: ApplicationError.NotFoundError, handler: handleNotFoundError },
  { constructor: ApplicationError.ConflictError, handler: handleConflictError },
];
