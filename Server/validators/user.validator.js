const { body } = require('express-validator');
const { nameRule, emailRule, addressRule, passwordRule } = require('./common.validator');

// Admin creating a new user (normal user, admin, or store owner)
exports.createUserValidator = [
  nameRule(),
  emailRule(),
  addressRule(),
  passwordRule('password'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'USER', 'OWNER'])
    .withMessage('Role must be one of ADMIN, USER, OWNER')
];
