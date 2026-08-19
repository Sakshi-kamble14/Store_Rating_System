const express = require('express');
const ratingController = require('../controllers/rating.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  submitRatingValidator,
  updateRatingValidator
} = require('../validators/rating.validator');

const router = express.Router();

router.use(protect, restrictTo('USER'));

router.get('/my', ratingController.getMyRatings);
router.post('/', validate(submitRatingValidator), ratingController.submitRating);
router.patch('/:id', validate(updateRatingValidator), ratingController.updateRating);

module.exports = router;
