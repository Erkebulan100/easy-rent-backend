const currencyService = require('../services/currency.service');
const { currencyValues } = require('../config/constants');

// Get all exchange rates
exports.getAllExchangeRates = async (req, res) => {
  try {
    const rates = await currencyService.getAllExchangeRates();
    
    res.status(200).json({
      success: true,
      data: rates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update an exchange rate
exports.updateExchangeRate = async (req, res) => {
  try {
    const { baseCurrency, targetCurrency, rate } = req.body;
    
    if (!baseCurrency || !targetCurrency || !rate) {
      return res.status(400).json({
        success: false,
        message: 'Base currency, target currency, and rate are required'
      });
    }
    
    // Validate currencies are in the allowed list
    if (!currencyValues.includes(baseCurrency) || !currencyValues.includes(targetCurrency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency code'
      });
    }
    
    // Validate rate is a positive number
    if (typeof rate !== 'number' || rate <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Rate must be a positive number'
      });
    }
    
    const updatedRate = await currencyService.updateExchangeRate(
      baseCurrency, 
      targetCurrency, 
      rate
    );
    
    res.status(200).json({
      success: true,
      data: updatedRate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Convert currency
exports.convertCurrency = async (req, res) => {
  try {
    const { amount, baseCurrency, targetCurrency } = req.body;
    
    if (!amount || !baseCurrency || !targetCurrency) {
      return res.status(400).json({
        success: false,
        message: 'Amount, base currency, and target currency are required'
      });
    }
    
    // Validate currencies are in the allowed list
    if (!currencyValues.includes(baseCurrency) || !currencyValues.includes(targetCurrency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency code'
      });
    }
    
    // Validate amount is a number
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number'
      });
    }
    
    const convertedAmount = await currencyService.convertCurrency(
      amount,
      baseCurrency,
      targetCurrency
    );
    
    res.status(200).json({
      success: true,
      data: {
        original: {
          amount,
          currency: baseCurrency
        },
        converted: {
          amount: convertedAmount,
          currency: targetCurrency
        },
        rate: await currencyService.getExchangeRate(baseCurrency, targetCurrency)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};