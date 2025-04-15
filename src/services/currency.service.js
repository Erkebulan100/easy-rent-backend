const CurrencyExchangeRate = require('../models/currency.model');
const xml2js = require('xml2js');
// No need to import fetch in Node.js v22

/**
 * Get the exchange rate between two currencies
 * @param {string} baseCurrency - The currency to convert from
 * @param {string} targetCurrency - The currency to convert to
 * @returns {Promise<number>} - The exchange rate
 */
const getExchangeRate = async (baseCurrency, targetCurrency) => {
  try {
    // If same currency, return 1
    if (baseCurrency === targetCurrency) {
      return 1;
    }
    
    // Find the exchange rate in the database
    const exchangeRate = await CurrencyExchangeRate.findOne({
      baseCurrency,
      targetCurrency
    });

    if (!exchangeRate) {
      // Check if inverse exchange rate exists
      const inverseRate = await CurrencyExchangeRate.findOne({
        baseCurrency: targetCurrency,
        targetCurrency: baseCurrency
      });

      if (inverseRate) {
        return 1 / inverseRate.rate;
      }

      throw new Error(`Exchange rate not found for ${baseCurrency} to ${targetCurrency}`);
    }

    return exchangeRate.rate;
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    throw new Error('Failed to get exchange rate');
  }
};

/**
 * Convert an amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} baseCurrency - The currency to convert from
 * @param {string} targetCurrency - The currency to convert to
 * @returns {Promise<number>} - The converted amount
 */
const convertCurrency = async (amount, baseCurrency, targetCurrency) => {
  try {
    const rate = await getExchangeRate(baseCurrency, targetCurrency);
    return amount * rate;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw new Error('Failed to convert currency');
  }
};

/**
 * Update or create an exchange rate
 * @param {string} baseCurrency - The currency to convert from
 * @param {string} targetCurrency - The currency to convert to
 * @param {number} rate - The exchange rate
 * @returns {Promise<Object>} - The updated or created exchange rate
 */
const updateExchangeRate = async (baseCurrency, targetCurrency, rate) => {
  try {
    return await CurrencyExchangeRate.findOneAndUpdate(
      { baseCurrency, targetCurrency },
      { rate, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.error('Error updating exchange rate:', error);
    throw new Error('Failed to update exchange rate');
  }
};

/**
 * Get all exchange rates
 * @returns {Promise<Array>} - All exchange rates
 */
const getAllExchangeRates = async () => {
  try {
    return await CurrencyExchangeRate.find().sort('baseCurrency targetCurrency');
  } catch (error) {
    console.error('Error getting all exchange rates:', error);
    throw new Error('Failed to get all exchange rates');
  }
};

/**
 * Fetch exchange rates from the National Bank of Kyrgyzstan
 * @returns {Promise<boolean>} - True if successful
 */
const fetchExchangeRatesFromNBKR = async () => {
  try {
    // NBKR API URL
    const response = await fetch('https://www.nbkr.kg/XML/daily.xml');
    const xmlText = await response.text();
    
    // Parse XML
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlText);
    
    if (!result.CurrencyRates || !result.CurrencyRates.Currency) {
      throw new Error('Invalid XML format from NBKR');
    }
    
    // Make sure Currency is an array even if there's only one currency
    const currencies = Array.isArray(result.CurrencyRates.Currency) 
      ? result.CurrencyRates.Currency 
      : [result.CurrencyRates.Currency];
    
    for (const currency of currencies) {
      const isoCode = currency.$.ISOCode;
      const nominal = parseFloat(currency.Nominal);
      // Replace comma with dot for proper parsing
      const valueText = currency.Value.replace(',', '.');
      const value = parseFloat(valueText);
      
      if (isoCode && !isNaN(value)) {
        // Update exchange rate (1 Foreign Currency = X SOM)
        await updateExchangeRate(isoCode, 'SOM', value / nominal);
        // Update inverse rate (1 SOM = 1/X Foreign Currency)
        await updateExchangeRate('SOM', isoCode, nominal / value);
        
        console.log(`Updated ${isoCode}-SOM rate: ${value / nominal}`);
      }
    }
    
    // Calculate cross-rates between all currencies
    const allRates = await getAllExchangeRates();
    const currencyCodes = [...new Set(allRates.map(rate => rate.baseCurrency))];
    
    for (const base of currencyCodes) {
      if (base === 'SOM') continue; // Skip SOM as base for cross-rates
      
      for (const target of currencyCodes) {
        if (target === 'SOM' || base === target) continue; // Skip SOM as target and same currency
        
        try {
          const baseToSom = await getExchangeRate(base, 'SOM');
          const somToTarget = await getExchangeRate('SOM', target);
          
          // Calculate cross rate: base -> target
          const crossRate = baseToSom * somToTarget;
          await updateExchangeRate(base, target, crossRate);
          
          console.log(`Updated cross-rate ${base}-${target}: ${crossRate}`);
        } catch (error) {
          console.error(`Error calculating cross-rate for ${base}-${target}:`, error.message);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error fetching exchange rates from NBKR:', error);
    throw new Error('Failed to fetch exchange rates from NBKR');
  }
};

module.exports = {
  getExchangeRate,
  convertCurrency,
  updateExchangeRate,
  getAllExchangeRates,
  fetchExchangeRatesFromNBKR
};