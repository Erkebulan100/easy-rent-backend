const Property = require('../models/property.model');

// Get all properties (with optional filtering)
exports.getAllProperties = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { propertyType, minPrice, maxPrice, bedrooms, city } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (propertyType) filter.propertyType = propertyType;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' }; // Case insensitive search
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    
    // Price filtering
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseInt(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseInt(maxPrice);
    }

    const properties = await Property.find(filter).populate('owner', 'name email');
    
    res.status(200).json({
      success: true,
      count: properties.length,
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

// Get a single property
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    // Add owner from authenticated user
    req.body.owner = req.user._id;
    
    const property = await Property.create(req.body);
    
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user is property owner
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }
    
    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user is property owner
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }
    
    await property.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Search properties using text search
exports.searchProperties = async (req, res) => {
  try {
    const { query, propertyType, minPrice, maxPrice, bedrooms, city } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add text search if query parameter is provided
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Add other filters
    if (propertyType) filter.propertyType = propertyType;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    
    // Price filtering
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseInt(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseInt(maxPrice);
    }

    // Execute the query, sort by text score if text search is used
    let properties;
    if (query) {
      properties = await Property.find(filter)
        .populate('owner', 'name email')
        .sort({ score: { $meta: 'textScore' } });
    } else {
      properties = await Property.find(filter)
        .populate('owner', 'name email');
    }
    
    res.status(200).json({
      success: true,
      count: properties.length,
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