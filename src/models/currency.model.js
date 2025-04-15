const mongoose = require('mongoose');

const currencyExchangeRateSchema = new mongoose.Schema({
  baseCurrency: {
    type: String,
    required: true,
    trim: true
  },
  targetCurrency: {
    type: String,
    required: true,
    trim: true
  },
  rate: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for faster lookups
currencyExchangeRateSchema.index({ baseCurrency: 1, targetCurrency: 1 }, { unique: true });

const CurrencyExchangeRate = mongoose.model('CurrencyExchangeRate', currencyExchangeRateSchema);

module.exports = CurrencyExchangeRate;