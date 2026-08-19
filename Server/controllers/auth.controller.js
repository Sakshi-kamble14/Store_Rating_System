const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  address: user.address,
  role: user.role
});

const sendAuthResponse = (user, statusCode, res) => {
  const token = signToken(user);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: sanitizeUser(user) }
  });
};

// POST /api/auth/signup — Normal users only (role forced to USER)
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, address } = req.body;

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.create({ name, email, passwordHash, address, role: 'USER' });

  sendAuthResponse(user, 201, res);
});

// POST /api/auth/login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  sendAuthResponse(user, 200, res);
});

// GET /api/auth/me
exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: sanitizeUser(req.user) } });
});

// PATCH /api/auth/update-password — available to every authenticated role
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await userRepository.findByIdWithPassword(req.user.id);
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updated = await userRepository.updatePassword(req.user.id, passwordHash);

  sendAuthResponse(updated, 200, res);
});

// POST /api/auth/logout — stateless JWT: client just discards the token.
exports.logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out. Please discard the token on the client.'
  });
};
