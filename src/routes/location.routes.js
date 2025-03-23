const express = require('express');
const locationController = require('../controllers/location.controller');
const router = express.Router();

// Geocode an address to get coordinates
router.post('/geocode', locationController.geocodeAddress);

// Reverse geocode coordinates to get address
router.post('/reverse-geocode', locationController.reverseGeocode);

module.exports = router;