const aiService = require('../services/ai.service');
const Property = require('../models/property.model');

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
    const searchParams = await aiService.processNaturalLanguageQuery(query);
    
    // Build filter object from extracted parameters
    const filter = {};
    
    if (searchParams.propertyType) filter.propertyType = searchParams.propertyType;
    if (searchParams.city) filter['location.city'] = { $regex: searchParams.city, $options: 'i' };
    if (searchParams.location) filter['location.address'] = { $regex: searchParams.location, $options: 'i' };
    if (searchParams.bedrooms) filter.bedrooms = { $gte: parseInt(searchParams.bedrooms) };
    
    // Price filtering
    if (searchParams.minPrice || searchParams.maxPrice) {
      filter['price.amount'] = {};
      if (searchParams.minPrice) filter['price.amount'].$gte = parseInt(searchParams.minPrice);
      if (searchParams.maxPrice) filter['price.amount'].$lte = parseInt(searchParams.maxPrice);
    }

    // Search for properties with the extracted parameters
    const properties = await Property.find(filter).populate('owner', 'name email');
    
    res.status(200).json({
      success: true,
      count: properties.length,
      searchParams,
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