const storeRepository = require('../repositories/store.repository');
const ratingRepository = require('../repositories/rating.repository');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// POST /api/ratings — submit a rating (creates, or updates if one already exists
// for this user+store, honoring the unique_user_store constraint)
exports.submitRating = catchAsync(async (req, res, next) => {
  const { store_id, rating } = req.body;

  const store = await storeRepository.findById(store_id);
  if (!store) return next(new AppError('No store found with that ID.', 404));

  const existing = await ratingRepository.findByUserAndStore(req.user.id, store_id);

  let record;
  let statusCode;
  if (existing) {
    record = await ratingRepository.updateByUserAndStore(req.user.id, store_id, rating);
    statusCode = 200;
  } else {
    record = await ratingRepository.create(req.user.id, store_id, rating);
    statusCode = 201;
  }

  res.status(statusCode).json({ status: 'success', data: { rating: record } });
});

// PATCH /api/ratings/:id — modify a previously submitted rating
exports.updateRating = catchAsync(async (req, res, next) => {
  const record = await ratingRepository.findById(req.params.id);

  if (!record) return next(new AppError('No rating found with that ID.', 404));
  if (record.user_id !== req.user.id) {
    return next(new AppError('You can only modify your own rating.', 403));
  }

  const updated = await ratingRepository.updateById(req.params.id, req.body.rating);

  res.status(200).json({ status: 'success', data: { rating: updated } });
});

// GET /api/ratings/my — all ratings submitted by the logged-in user
exports.getMyRatings = catchAsync(async (req, res) => {
  const ratings = await ratingRepository.findAllByUser(req.user.id);
  res.status(200).json({ status: 'success', results: ratings.length, data: { ratings } });
});
