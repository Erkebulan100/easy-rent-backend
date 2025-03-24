const express = require('express');
const uploadController = require('../controllers/upload.controller');
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const router = express.Router();

// Configure multer for memory storage (files stored in memory as Buffer objects)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024 // Limit to 5MB
  }
});

// Upload property image (requires authentication - landlords only)
router.post('/property-image', auth, (req, res, next) => {
  if (req.user.role !== 'landlord' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Only landlords can upload property images' 
    });
  }
  next();
}, upload.single('image'), uploadController.uploadPropertyImage);

// Upload user document (requires authentication)
router.post('/document', auth, upload.single('document'), uploadController.uploadUserDocument);

// Delete file (requires authentication)
router.delete('/file', auth, uploadController.deleteFile);

module.exports = router;