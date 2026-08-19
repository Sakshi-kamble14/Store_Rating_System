const { body } = require('express-validator');
const { nameRule, emailRule, addressRule, passwordRule } = require('./common.validator');

exports.signupValidator = [nameRule(), emailRule(), addressRule(), passwordRule('password')];

exports.loginValidator = [
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.updatePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordRule('newPassword')
];
