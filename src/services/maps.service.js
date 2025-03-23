const { Client } = require('@googlemaps/google-maps-services-js');

// Initialize Google Maps client
const googleMapsClient = new Client({});

/**
 * Geocode an address to get coordinates
 * @param {string} address - Full address to geocode
 * @returns {Promise<Object>} - Coordinates {lat, lng} and formatted address
 */
const geocodeAddress = async (address) => {
  try {
    const response = await googleMapsClient.geocode({
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK' || !response.data.results.length) {
      throw new Error('Geocoding failed or no results found');
    }

    const result = response.data.results[0];
    return {
      coordinates: {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng
      },
      formattedAddress: result.formatted_address
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to geocode address');
  }
};

/**
 * Reverse geocode coordinates to get address
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<string>} - Formatted address
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await googleMapsClient.reverseGeocode({
      params: {
        latlng: { lat: latitude, lng: longitude },
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK' || !response.data.results.length) {
      throw new Error('Reverse geocoding failed or no results found');
    }

    return response.data.results[0].formatted_address;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Failed to reverse geocode coordinates');
  }
};

module.exports = {
  geocodeAddress,
  reverseGeocode
};