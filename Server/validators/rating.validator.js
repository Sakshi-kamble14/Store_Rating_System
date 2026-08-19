const { body } = require('express-validator');

exports.submitRatingValidator = [
  body('store_id').isInt().withMessage('store_id must be an integer'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5')
];

exports.updateRatingValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5')
];
