const express = require('express');
const aiController = require('../controllers/ai.controller');
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const router = express.Router();

// Configure multer for memory storage (files stored in memory as Buffer objects)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024 // Limit to 10MB
  }
});

// Process natural language query (public route)
router.post('/query', aiController.processQuery);

// Transcribe audio to text (public route)
router.post('/transcribe', upload.single('audio'), aiController.transcribeAudio);

module.exports = router;