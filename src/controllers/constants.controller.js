const { currency, paymentPeriod } = require('../config/constants');

// Get currency and payment period options
exports.getOptions = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        currency,
        paymentPeriod
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