const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);
// All routes require authentication
router.use(auth);

// Get own profile
router.get('/profile', userController.getProfile);

// Update own profile
router.patch('/profile', upload.none(), userController.updateProfile);

module.exports = router;