/**
 * Async Handler Middleware
 * Wraps async route handlers and catches any errors, passing them to the error handling middleware
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;