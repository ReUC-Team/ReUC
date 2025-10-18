import * as ApplicationError from "@reuc/application/errors/index.js";

/**
 * A centralized error handling middleware for the Express application.
 *
 * This function should be the LAST middleware registered with the app.
 * It catches all errors passed to `next()` and formats them into a consistent
 * JSON response, mapping specific ApplicationError types to the correct
 * HTTP status codes.
 */
function errorHandler(err, req, res, next) {
  console.error(`Presentation Error (${req.path}):`, err);

  if (err instanceof ApplicationError.ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: err.errorCode,
        message: "The provided input is invalid.",
        details: err.details,
      },
    });
  }

  if (err instanceof ApplicationError.AuthenticationError) {
    return res.status(401).json({
      success: false,
      error: {
        code: err.errorCode,
        message:
          "Authentication failed. The request could not be authenticated.",
      },
    });
  }

  if (err instanceof ApplicationError.AuthorizationError) {
    return res.status(403).json({
      success: false,
      error: {
        code: err.errorCode,
        message:
          "Access denied. You do not have permission to perform this action.",
      },
    });
  }

  if (err instanceof ApplicationError.NotFoundError) {
    return res.status(404).json({
      success: false,
      error: {
        code: err.errorCode,
        message: "The requested resource could not be found.",
      },
    });
  }

  if (err instanceof ApplicationError.ConflictError) {
    return res.status(409).json({
      success: false,
      error: {
        code: err.errorCode,
        message: "A conflict occurred with an existing resource.",
        details: err.details,
      },
    });
  }

  // --- Fallback for all other errors (generic ApplicationError and unexpected errors) ---

  return res.status(500).json({
    success: false,
    error: {
      code: err.errorCode || "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred.",
    },
  });
}

export default errorHandler;
