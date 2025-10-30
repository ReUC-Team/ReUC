import { handlerMap, handleDefaultError } from "./handlers.js";

/**
 * A centralized error handling middleware for the Express application.
 *
 * This function should be the LAST middleware registered with the app.
 * It catches all errors passed to `next()`, logs them, and then delegates
 * formatting and response to a specific handler from the handlerMap.
 */
function errorHandler(err, req, res, next) {
  console.error(`Presentation Error (${req.path}):`, err);

  // Find the correct handler from the map
  for (const { constructor, handler } of handlerMap) {
    if (err instanceof constructor) {
      const { status, body } = handler(err);
      return res.status(status).json(body);
    }
  }

  // --- Fallback for all other errors ---
  // If no specific handler is found, use the default
  const { status, body } = handleDefaultError(err);
  return res.status(status).json(body);
}

export default errorHandler;
