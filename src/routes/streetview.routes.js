const express = require('express');
const streetViewController = require('../controllers/streetview.controller');
const router = express.Router();

/**
 * @swagger
 * /api/streetview/metadata:
 *   post:
 *     summary: Get Street View panorama metadata for a location
 *     tags: [Street View]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *                 description: Latitude coordinate
 *               longitude:
 *                 type: number
 *                 description: Longitude coordinate
 *     responses:
 *       200:
 *         description: Street View metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     available:
 *                       type: boolean
 *                     panoramaId:
 *                       type: string
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *       400:
 *         description: Latitude and longitude are required
 *       500:
 *         description: Failed to get Street View metadata
 */
router.post('/metadata', streetViewController.getStreetViewMetadata);

/**
 * @swagger
 * /api/streetview/image-url:
 *   post:
 *     summary: Generate a Street View image URL
 *     tags: [Street View]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *                 description: Latitude coordinate
 *               longitude:
 *                 type: number
 *                 description: Longitude coordinate
 *               heading:
 *                 type: number
 *                 description: Compass heading (0-360 degrees)
 *               pitch:
 *                 type: number
 *                 description: Up/down angle (-90 to 90 degrees)
 *               fov:
 *                 type: number
 *                 description: Field of view (0-120 degrees)
 *               width:
 *                 type: number
 *                 description: Image width in pixels
 *               height:
 *                 type: number
 *                 description: Image height in pixels
 *     responses:
 *       200:
 *         description: Street View image URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *       400:
 *         description: Latitude and longitude are required
 *       500:
 *         description: Failed to generate Street View image URL
 */
router.post('/image-url', streetViewController.getStreetViewImageUrl);

module.exports = router;