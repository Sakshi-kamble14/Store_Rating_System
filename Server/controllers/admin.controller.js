const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const storeRepository = require('../repositories/store.repository');
const ratingRepository = require('../repositories/rating.repository');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { buildPagination } = require('../utils/queryHelpers');

// GET /api/admin/dashboard
// GET /api/admin/dashboard
exports.getDashboard = catchAsync(async (req, res) => {
  const [totalUsers, totalStores, totalRatings, ratingAnalytics] =
    await Promise.all([
      userRepository.count(),
      storeRepository.count(),
      ratingRepository.count(),
      ratingRepository.getGlobalAnalytics()
    ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalStores,
      totalRatings,
      ratingAnalytics
    }
  });
});

// POST /api/admin/users — create a normal user, admin, or store owner
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, address, role } = req.body;

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.create({ name, email, passwordHash, address, role: role || 'USER' });

  res.status(201).json({
    status: 'success',
    data: { user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role } }
  });
});

// GET /api/admin/users — list with filters (name/email/address/role) + sorting
exports.getUsers = catchAsync(async (req, res) => {
  const { page, limit, offset } = buildPagination(req.query);

  const { rows, total } = await userRepository.findAndCount({
    name: req.query.name,
    email: req.query.email,
    address: req.query.address,
    role: req.query.role,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
    limit,
    offset
  });

  res.status(200).json({
    status: 'success',
    results: rows.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: { users: rows }
  });
});

// GET /api/admin/users/:id — includes the store's rating if user is an OWNER
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await userRepository.findById(req.params.id);
  if (!user) return next(new AppError('No user found with that ID.', 404));

  let ownerRating = null;
  let stores = [];
  if (user.role === 'OWNER') {
    stores = await storeRepository.findByOwner(user.id);
    if (stores.length) {
      ownerRating = await ratingRepository.findAverageForOwner(user.id);
    }
  }

  res.status(200).json({
    status: 'success',
    data: { user: { ...user, stores }, rating: ownerRating }
  });
});

// GET /api/admin/stores — list with filters (name/email/address) + sorting
exports.getStores = catchAsync(async (req, res) => {
  const { page, limit, offset } = buildPagination(req.query);

  const { rows, total } = await storeRepository.findAndCountForAdmin({
    name: req.query.name,
    email: req.query.email,
    address: req.query.address,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
    limit,
    offset
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

// POST /api/admin/stores — create a store, assigned to an existing OWNER
exports.createStore = catchAsync(async (req, res, next) => {
  const { name, email, address, owner_id } = req.body;

  const isOwner = await userRepository.isOwner(owner_id);
  if (!isOwner) {
    return next(new AppError('owner_id must reference a user with role OWNER.', 400));
  }

  const store = await storeRepository.create({ name, email, address, owner_id });

  res.status(201).json({ status: 'success', data: { store } });
});
