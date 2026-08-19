const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  let error = err;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // MySQL duplicate key (unique constraint) violation, e.g. duplicate email
  // or a second rating for the same user_id + store_id.
  if (err.code === 'ER_DUP_ENTRY') {
    error = new AppError('Duplicate value: this record already exists.', 409);
  }

  // Foreign key constraint failures (e.g. owner_id/store_id/user_id pointing
  // to a row that doesn't exist).
  if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    error = new AppError('Referenced record does not exist.', 400);
  }

  // CHECK constraint violation (rating outside 1-5), MySQL 8.0.16+.
  if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    error = new AppError('Rating must be between 1 and 5.', 400);
  }

  // Required column left NULL.
  if (err.code === 'ER_BAD_NULL_ERROR') {
    error = new AppError('A required field is missing.', 400);
  }

  // Invalid/expired JWT
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your session has expired. Please log in again.', 401);
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.isOperational ? error.message : 'Something went wrong on the server.'
  });
};
