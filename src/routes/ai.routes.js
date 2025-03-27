const express = require('express');
const aiController = require('../controllers/ai.controller');
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     QueryResult:
 *       type: object
 *       properties:
 *         searchParams:
 *           type: object
 *           properties:
 *             propertyType:
 *               type: string
 *               description: Type of property (apartment, house, studio, room)
 *             minPrice:
 *               type: number
 *               description: Minimum price
 *             maxPrice:
 *               type: number
 *               description: Maximum price
 *             bedrooms:
 *               type: number
 *               description: Number of bedrooms
 *             city:
 *               type: string
 *               description: City name
 *             location:
 *               type: string
 *               description: Specific location within city
 */

// Configure multer for memory storage (files stored in memory as Buffer objects)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024 // Limit to 10MB
  }
});

/**
 * @swagger
 * /api/ai/query:
 *   post:
 *     summary: Process natural language query
 *     tags: [AI Assistant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Natural language query (e.g., "find me a two-bedroom apartment in Bishkek for $500")
 *     responses:
 *       200:
 *         description: Query processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 searchParams:
 *                   $ref: '#/components/schemas/QueryResult'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *       400:
 *         description: Query is required
 *       500:
 *         description: Server error
 */
// Process natural language query (public route)
router.post('/query', aiController.processQuery);

/**
 * @swagger
 * /api/ai/transcribe:
 *   post:
 *     summary: Transcribe audio to text
 *     tags: [AI Assistant]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - audio
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Audio file to transcribe
 *     responses:
 *       200:
 *         description: Audio transcribed successfully
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
 *                     transcription:
 *                       type: string
 *       400:
 *         description: Audio file is required
 *       500:
 *         description: Failed to transcribe audio
 */
// Transcribe audio to text (public route)
router.post('/transcribe', upload.single('audio'), aiController.transcribeAudio);

module.exports = router;