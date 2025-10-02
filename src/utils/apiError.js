/**
 * API Error Class
 * Custom error class for API responses with status codes and error messages
 */

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Factory functions for common error types
 */
const createBadRequestError = (message = 'Bad Request') => new ApiError(400, message);
const createUnauthorizedError = (message = 'Unauthorized') => new ApiError(401, message);
const createForbiddenError = (message = 'Forbidden') => new ApiError(403, message);
const createNotFoundError = (message = 'Not Found') => new ApiError(404, message);
const createConflictError = (message = 'Conflict') => new ApiError(409, message);
const createValidationError = (message = 'Validation Error') => new ApiError(422, message);
const createInternalServerError = (message = 'Internal Server Error') => new ApiError(500, message);

module.exports = {
  ApiError,
  createBadRequestError,
  createUnauthorizedError,
  createForbiddenError,
  createNotFoundError,
  createConflictError,
  createValidationError,
  createInternalServerError
};