const express = require('express');
const ownerController = require('../controllers/owner.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, restrictTo('OWNER'));

router.get('/dashboard', ownerController.getDashboard);

module.exports = router;
