const { Client } = require('@googlemaps/google-maps-services-js');
const axios = require('axios');

// Initialize Google Maps client
const googleMapsClient = new Client({});

/**
 * Get Street View panorama metadata for a specific location
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} - Street View metadata or null if not available
 */
const getStreetViewPanorama = async (latitude, longitude) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${latitude},${longitude}&key=${apiKey}`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.status === 'OK') {
      return {
        available: true,
        panoramaId: response.data.pano_id,
        latitude: response.data.location.lat,
        longitude: response.data.location.lng,
        date: response.data.date
      };
    }
    
    return { available: false };
  } catch (error) {
    console.error('Street View API error:', error);
    return { available: false, error: error.message };
  }
};

/**
 * Generate a Street View image URL for a specific location
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {number} heading - Compass heading (0-360 degrees)
 * @param {number} pitch - Up/down angle (-90 to 90 degrees)
 * @param {number} fov - Field of view (0-120 degrees)
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @returns {string} - Street View image URL
 */
const generateStreetViewImageUrl = (latitude, longitude, heading = 0, pitch = 0, fov = 90, width = 600, height = 400) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/streetview';
  
  return `${baseUrl}?location=${latitude},${longitude}&size=${width}x${height}&heading=${heading}&pitch=${pitch}&fov=${fov}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
};

module.exports = {
  getStreetViewPanorama,
  generateStreetViewImageUrl
};