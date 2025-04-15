require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config/config');
const currencyService = require('../src/services/currency.service');

// Connect to the database
mongoose.connect(config.mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      console.log('Fetching exchange rates from NBKR...');
      await currencyService.fetchExchangeRatesFromNBKR();
      console.log('Exchange rates updated successfully');
    } catch (error) {
      console.error('Error updating exchange rates:', error);
    } finally {
      // Disconnect from the database
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });