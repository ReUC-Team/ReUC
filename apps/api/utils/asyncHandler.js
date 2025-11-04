/**
 * A higher-order function to wrap async route handlers, catching any errors
 * and passing them to the Express error handling middleware.
 * This eliminates the need for try-catch blocks in every route.
 *
 * @param {function} fn - The asynchronous route handler function.
 *
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
