const express = require('express');
const constantsController = require('../controllers/constants.controller');
const router = express.Router();

// Get currency and payment period options
router.get('/options', constantsController.getOptions);

module.exports = router;