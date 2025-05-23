const aiService = require('../services/ai.service');
const Property = require('../models/property.model');
// After building the filter object and before searching for properties
// Add this code to check if there are any search parameters

// Process natural language query and return search results
exports.processQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    // Process the natural language query
    const aiResponse = await aiService.processNaturalLanguageQuery(query);
    
    // Build filter object from extracted parameters
    const filter = {};
    const searchParams = aiResponse.searchParams;
    
    if (searchParams.propertyType) filter.propertyType = searchParams.propertyType;
    if (searchParams.city) filter['location.city'] = { $regex: searchParams.city, $options: 'i' };
    if (searchParams.district) filter['location.district'] = { $regex: searchParams.district, $options: 'i' };
    if (searchParams.microdistrict) filter['location.microdistrict'] = { $regex: searchParams.microdistrict, $options: 'i' };
    if (searchParams.bedrooms) filter.bedrooms = { $gte: parseInt(searchParams.bedrooms) };
    if (searchParams.bathrooms) filter.bathrooms = { $gte: parseInt(searchParams.bathrooms) };
    
    // Area filtering
    if (searchParams.minArea || searchParams.maxArea) {
      filter.area = {};
      if (searchParams.minArea) filter.area.$gte = parseInt(searchParams.minArea);
      if (searchParams.maxArea) filter.area.$lte = parseInt(searchParams.maxArea);
    }
    
    // Price filtering
    if (searchParams.minPrice || searchParams.maxPrice) {
      filter['price.amount'] = {};
      if (searchParams.minPrice) filter['price.amount'].$gte = parseInt(searchParams.minPrice);
      if (searchParams.maxPrice) filter['price.amount'].$lte = parseInt(searchParams.maxPrice);
    }
    
    // Facilities
    if (searchParams.parking !== undefined) filter['facilities.parking'] = searchParams.parking;
    
    // Payment period
    if (searchParams.paymentPeriod) filter['price.paymentPeriod'] = searchParams.paymentPeriod;

   // Check if there are any search parameters
const hasSearchParams = Object.keys(filter).length > 0;

    // Only search for properties if search parameters exist
    let properties = [];
    if (hasSearchParams) {
      // Search for properties with the extracted parameters
      properties = await Property.find(filter).populate('owner', 'name email');
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      conversationalResponse: aiResponse.conversationalResponse,
      searchParams: aiResponse.searchParams,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Transcribe audio to text
exports.transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }
    
    // Get the audio file buffer
    const audioBuffer = req.file.buffer;
    
    // Transcribe the audio
    const transcription = await aiService.transcribeAudio(audioBuffer);
    
    res.status(200).json({
      success: true,
      data: {
        transcription
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