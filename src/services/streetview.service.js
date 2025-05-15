const { Client } = require('@googlemaps/google-maps-services-js');

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
    const response = await googleMapsClient.streetView({
      params: {
        location: { lat: latitude, lng: longitude },
        key: process.env.GOOGLE_MAPS_API_KEY,
        // The size parameter is required but not relevant for metadata
        size: '600x400'
      }
    });

    // If the response has a status of OK, it means Street View is available
    if (response.status === 200) {
      return {
        available: true,
        panoramaId: response.headers.get('X-Panorama-Id'),
        latitude,
        longitude
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