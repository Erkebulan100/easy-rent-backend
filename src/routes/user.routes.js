const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Get own profile
router.get('/profile', userController.getProfile);

// Update own profile
router.patch('/profile', userController.updateProfile);

module.exports = router;