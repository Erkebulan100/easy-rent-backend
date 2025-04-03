const express = require('express');
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(auth);
router.use(adminMiddleware);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get user by ID
router.get('/users/:id', adminController.getUserById);

// Update user
router.put('/users/:id', adminController.updateUser);
router.patch('/users/:id', adminController.updateUser);
// Delete user
router.delete('/users/:id', adminController.deleteUser);

// Get dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;