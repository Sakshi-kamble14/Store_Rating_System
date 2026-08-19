const express = require('express');
const storeController = require('../controllers/store.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', storeController.getAllStores);

module.exports = router;
