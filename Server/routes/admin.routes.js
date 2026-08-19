const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createUserValidator } = require('../validators/user.validator');
const { createStoreValidator } = require('../validators/store.validator');

const router = express.Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/dashboard', adminController.getDashboard);

router.get('/users', adminController.getUsers);
router.post('/users', validate(createUserValidator), adminController.createUser);
router.get('/users/:id', adminController.getUserById);

router.get('/stores', adminController.getStores);
router.post('/stores', validate(createStoreValidator), adminController.createStore);

module.exports = router;
