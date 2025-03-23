const mapsService = require('../services/maps.service');

// Geocode an address
exports.geocodeAddress = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }
    
    const geocodeResult = await mapsService.geocodeAddress(address);
    
    res.status(200).json({
      success: true,
      data: geocodeResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to geocode address'
    });
  }
};

// Reverse geocode coordinates
exports.reverseGeocode = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const address = await mapsService.reverseGeocode(latitude, longitude);
    
    res.status(200).json({
      success: true,
      data: { address }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reverse geocode coordinates'
    });
  }
};