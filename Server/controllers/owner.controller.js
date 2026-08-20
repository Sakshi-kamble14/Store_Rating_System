const storeRepository = require('../repositories/store.repository');
const ratingRepository = require('../repositories/rating.repository');
const catchAsync = require('../utils/catchAsync');

// GET /api/owner/dashboard
// Average rating + rating analytics + list of raters for every store
// owned by this user.
exports.getDashboard = catchAsync(async (req, res) => {
  const stores = await storeRepository.findOwnerStoresWithAverage(req.user.id);

  if (!stores.length) {
    return res.status(200).json({
      status: 'success',
      data: {
        stores: []
      }
    });
  }

  const storeIds = stores.map((s) => s.id);

  const raters = await ratingRepository.findRatersForStores(storeIds);

  const data = stores.map((store) => {
    const storeRaters = raters.filter(
      (r) => r.store_id === store.id
    );

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    storeRaters.forEach((rater) => {
      const rating = Number(rater.rating);

      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating]++;
      }
    });

    const totalRatings = storeRaters.length;

    return {
      storeId: store.id,
      storeName: store.name,
      address: store.address,
      averageRating: store.average_rating
        ? Number(store.average_rating)
        : 0,
      totalRatings,
      ratingDistribution,
      raters: storeRaters.map((r) => ({
        userId: r.user_id,
        name: r.name,
        email: r.email,
        rating: r.rating
      }))
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      stores: data
    }
  });
});