const express = require('express');
const locationController = require('../controllers/location.controller');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GeocodeResult:
 *       type: object
 *       properties:
 *         coordinates:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: Latitude coordinate
 *             longitude:
 *               type: number
 *               description: Longitude coordinate
 *         formattedAddress:
 *           type: string
 *           description: Formatted address returned by Google Maps
 */

/**
 * @swagger
 * /api/location/geocode:
 *   post:
 *     summary: Geocode an address to get coordinates
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *                 description: Address to geocode
 *     responses:
 *       200:
 *         description: Geocoding successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GeocodeResult'
 *       400:
 *         description: Address is required
 *       500:
 *         description: Failed to geocode address
 */
// Geocode an address to get coordinates
router.post('/geocode', locationController.geocodeAddress);

/**
 * @swagger
 * /api/location/reverse-geocode:
 *   post:
 *     summary: Reverse geocode coordinates to get address
 *     tags: [Location]
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
 *         description: Reverse geocoding successful
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
 *                     address:
 *                       type: string
 *       400:
 *         description: Latitude and longitude are required
 *       500:
 *         description: Failed to reverse geocode coordinates
 */
// Reverse geocode coordinates to get address
router.post('/reverse-geocode', locationController.reverseGeocode);

module.exports = router;