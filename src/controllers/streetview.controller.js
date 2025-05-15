const streetViewService = require('../services/streetview.service');

// Get Street View panorama metadata
exports.getStreetViewMetadata = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const panoramaData = await streetViewService.getStreetViewPanorama(
      parseFloat(latitude),
      parseFloat(longitude)
    );
    
    res.status(200).json({
      success: true,
      data: panoramaData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get Street View metadata'
    });
  }
};

// Get Street View image URL
exports.getStreetViewImageUrl = async (req, res) => {
  try {
    const { latitude, longitude, heading, pitch, fov, width, height } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const imageUrl = streetViewService.generateStreetViewImageUrl(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(heading) || 0,
      parseFloat(pitch) || 0,
      parseFloat(fov) || 90,
      parseInt(width) || 600,
      parseInt(height) || 400
    );
    
    res.status(200).json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate Street View image URL'
    });
  }
};