const mapsJsService = require('../services/maps-js.service');

// Get Maps JavaScript API configuration
exports.getMapsConfig = async (req, res) => {
  try {
    const config = mapsJsService.getMapsJsConfig();
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Maps JavaScript API URL
exports.getMapsApiUrl = async (req, res) => {
  try {
    const apiUrl = mapsJsService.getMapsJsApiUrl();
    
    res.status(200).json({
      success: true,
      data: {
        apiUrl
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