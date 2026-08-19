const { body } = require('express-validator');
const { nameRule, emailRule, addressRule } = require('./common.validator');

exports.createStoreValidator = [
  nameRule(),
  emailRule(),
  addressRule(),
  body('owner_id').isInt().withMessage('owner_id is required and must be an integer')
];
