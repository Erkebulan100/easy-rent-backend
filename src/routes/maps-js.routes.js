const express = require('express');
const mapsJsController = require('../controllers/maps-js.controller');
const router = express.Router();

/**
 * @swagger
 * /api/maps-js/config:
 *   get:
 *     summary: Get Maps JavaScript API configuration
 *     tags: [Maps]
 *     responses:
 *       200:
 *         description: Maps JavaScript API configuration
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
 *                     apiKey:
 *                       type: string
 *                     libraries:
 *                       type: array
 *                       items:
 *                         type: string
 *                     version:
 *                       type: string
 */
router.get('/config', mapsJsController.getMapsConfig);

/**
 * @swagger
 * /api/maps-js/api-url:
 *   get:
 *     summary: Get Maps JavaScript API URL
 *     tags: [Maps]
 *     responses:
 *       200:
 *         description: Maps JavaScript API URL
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
 *                     apiUrl:
 *                       type: string
 */
router.get('/api-url', mapsJsController.getMapsApiUrl);

module.exports = router;