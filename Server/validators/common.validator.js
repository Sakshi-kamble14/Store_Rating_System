const { body } = require('express-validator');

// Name: Min 20, Max 60 characters.
exports.nameRule = () =>
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters');

// Email: standard email validation.
exports.emailRule = () =>
  body('email').trim().isEmail().withMessage('Must be a valid email address').normalizeEmail();

// Address: required (NOT NULL in schema), max 400 characters.
exports.addressRule = () =>
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters');

// Password: 8-16 characters, at least one uppercase letter and one special character.
exports.passwordRule = (field = 'password') =>
  body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/)
    .withMessage('Password must contain at least one special character');
