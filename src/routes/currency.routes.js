const express = require('express');
const currencyController = require('../controllers/currency.controller');
const auth = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const router = express.Router();

// Get all exchange rates (public access)
router.get('/rates', currencyController.getAllExchangeRates);

// Convert currency (public access)
router.post('/convert', currencyController.convertCurrency);

// Update exchange rate (admin only)
router.post(
  '/rates', 
  auth, 
  adminMiddleware, 
  currencyController.updateExchangeRate
);

module.exports = router;