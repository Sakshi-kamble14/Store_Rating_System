const storeRepository = require('../repositories/store.repository');
const catchAsync = require('../utils/catchAsync');
const { buildPagination } = require('../utils/queryHelpers');

// GET /api/stores — list all stores, searchable by name & address, with overall
// rating and the current user's own submitted rating (if any)
exports.getAllStores = catchAsync(async (req, res) => {
  const { page, limit, offset } = buildPagination(req.query);

  const { rows, total } = await storeRepository.findAndCountForUser({
    name: req.query.name,
    address: req.query.address,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
    limit,
    offset,
    userId: req.user.id
  });

  res.status(200).json({
    status: 'success',
    results: rows.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: { stores: rows }
  });
});
