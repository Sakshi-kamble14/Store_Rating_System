const storeRepository = require('../repositories/store.repository');
const ratingRepository = require('../repositories/rating.repository');
const catchAsync = require('../utils/catchAsync');

// GET /api/owner/dashboard — average rating + list of raters for every store this owner has
exports.getDashboard = catchAsync(async (req, res) => {
  const stores = await storeRepository.findOwnerStoresWithAverage(req.user.id);

  if (!stores.length) {
    return res.status(200).json({ status: 'success', data: { stores: [] } });
  }

  const storeIds = stores.map((s) => s.id);
  const raters = await ratingRepository.findRatersForStores(storeIds);

  const data = stores.map((store) => ({
    storeId: store.id,
    storeName: store.name,
    address: store.address,
    averageRating: store.average_rating,
    raters: raters
      .filter((r) => r.store_id === store.id)
      .map((r) => ({ userId: r.user_id, name: r.name, email: r.email, rating: r.rating }))
  }));

  res.status(200).json({ status: 'success', data: { stores: data } });
});
