const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Runs an array of express-validator chains, then checks the result.
module.exports = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const messages = errors.array().map((e) => `${e.path}: ${e.msg}`).join('. ');
  next(new AppError(messages, 400));
};
