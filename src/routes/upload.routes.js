const express = require('express');
const uploadController = require('../controllers/upload.controller');
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FileUploadResult:
 *       type: object
 *       properties:
 *         fileUrl:
 *           type: string
 *           description: URL of the uploaded file
 */

// Configure multer for memory storage (files stored in memory as Buffer objects)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024 // Limit to 5MB
  }
});

/**
 * @swagger
 * /api/uploads/property-image:
 *   post:
 *     summary: Upload property image
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FileUploadResult'
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Only landlords can upload property images
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/uploads/document:
 *   post:
 *     summary: Upload user document
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Document file to upload
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FileUploadResult'
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
// Upload user document (requires authentication)
router.post('/document', auth, upload.single('document'), uploadController.uploadUserDocument);

/**
 * @swagger
 * /api/uploads/file:
 *   delete:
 *     summary: Delete a file
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileUrl
 *             properties:
 *               fileUrl:
 *                 type: string
 *                 description: URL of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: File URL is required
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
// Delete file (requires authentication)
router.delete('/file', auth, uploadController.deleteFile);

module.exports = router;