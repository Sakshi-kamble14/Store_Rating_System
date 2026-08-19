const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  signupValidator,
  loginValidator,
  updatePasswordValidator
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/signup', validate(signupValidator), authController.signup);
router.post('/login', validate(loginValidator), authController.login);

router.use(protect); // everything below requires a valid JWT

router.get('/me', authController.getMe);
router.post('/logout', authController.logout);
router.patch('/update-password', validate(updatePasswordValidator), authController.updatePassword);

module.exports = router;
