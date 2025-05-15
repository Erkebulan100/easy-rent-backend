const config = require('../config/config');

/**
 * Get Google Maps JavaScript API configuration
 * @returns {Object} - Configuration object for Maps JavaScript API
 */
const getMapsJsConfig = () => {
  return {
    apiKey: config.googleMapsApiKey,
    libraries: ['places', 'geometry'],
    version: 'weekly' // Or specify a specific version like 'quarterly', 'weekly', etc.
  };
};

/**
 * Generate a Google Maps JavaScript API URL with your API key
 * @returns {String} - URL to include in frontend
 */
const getMapsJsApiUrl = () => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/js';
  const params = new URLSearchParams({
    key: config.googleMapsApiKey,
    libraries: 'places,geometry',
    v: 'weekly'
  });
  
  return `${baseUrl}?${params.toString()}`;
};

module.exports = {
  getMapsJsConfig,
  getMapsJsApiUrl
};