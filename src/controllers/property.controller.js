const Property = require('../models/property.model');
const mapsService = require('../services/maps.service');

// Get all properties (with optional filtering)
// Update the getAllProperties method to support the new filters
exports.getAllProperties = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { 
      propertyType, minPrice, maxPrice, bedrooms, city, 
      district, microdistrict, floor, minArea, maxArea,
      minLandArea, maxLandArea, buildingClass, wallMaterial,
      separateBathroom, parking, paymentPeriod
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Basic filters
    if (propertyType) filter.propertyType = propertyType;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' }; // Case insensitive search
    if (district) filter['location.district'] = { $regex: district, $options: 'i' };
    if (microdistrict) filter['location.microdistrict'] = { $regex: microdistrict, $options: 'i' };
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    
    // Price filtering
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseInt(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseInt(maxPrice);
    }

    // Payment period
    if (paymentPeriod) filter['price.paymentPeriod'] = paymentPeriod;
    
    // Area filters
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseInt(minArea);
      if (maxArea) filter.area.$lte = parseInt(maxArea);
    }
    
    // Land area filters (for houses)
    if (minLandArea || maxLandArea) {
      filter['areaDetails.landArea'] = {};
      if (minLandArea) filter['areaDetails.landArea'].$gte = parseInt(minLandArea);
      if (maxLandArea) filter['areaDetails.landArea'].$lte = parseInt(maxLandArea);
    }
    
    // Building details
    if (floor) filter['buildingDetails.floor'] = parseInt(floor);
    if (buildingClass) filter['buildingDetails.buildingClass'] = buildingClass;
    if (wallMaterial) filter['buildingDetails.wallMaterial'] = wallMaterial;
    
    // Facilities
    if (separateBathroom) filter['facilities.separateBathroom'] = separateBathroom === 'true';
    if (parking) filter['facilities.parking'] = parking === 'true';

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
// Create a new property
// Create a new property
exports.createProperty = async (req, res) => {
  try {
    // Add owner from authenticated user
    req.body.owner = req.user._id;
    
    // If address is provided but coordinates are not, geocode the address
    if (
      req.body.location && 
      req.body.location.address && 
      (!req.body.location.coordinates || 
       !req.body.location.coordinates.latitude || 
       !req.body.location.coordinates.longitude)
    ) {
      try {
        const fullAddress = `${req.body.location.address}, ${req.body.location.city || ''}`;
        const geocodeResult = await mapsService.geocodeAddress(fullAddress);
        
       // Update the property data with coordinates
req.body.location.coordinates = {
  latitude: geocodeResult.coordinates.latitude,
  longitude: geocodeResult.coordinates.longitude
};

// If city is not provided, try to extract it from geocode result
if (!req.body.location.city && geocodeResult.addressComponents) {
  const cityComponent = geocodeResult.addressComponents.find(
    comp => comp.types.includes('locality') || comp.types.includes('administrative_area_level_1')
  );
  if (cityComponent) {
    req.body.location.city = cityComponent.long_name;
  }
}
        
        // If district is not provided, try to extract it from geocode result
        if (!req.body.location.district && geocodeResult.addressComponents) {
          const districtComponent = geocodeResult.addressComponents.find(
            comp => comp.types.includes('sublocality_level_1') || comp.types.includes('administrative_area_level_2')
          );
          if (districtComponent) {
            req.body.location.district = districtComponent.long_name;
          }
        }
        
        // If microdistrict is not provided, try to extract it from geocode result
        if (!req.body.location.microdistrict && geocodeResult.addressComponents) {
          const microComponent = geocodeResult.addressComponents.find(
            comp => comp.types.includes('neighborhood') || comp.types.includes('sublocality_level_2')
          );
          if (microComponent) {
            req.body.location.microdistrict = microComponent.long_name;
          }
        }
        
        // Optionally update with the formatted address from Google
        if (!req.body.location.address || req.body.location.address.trim() === '') {
          req.body.location.address = geocodeResult.formattedAddress;
        }
      } catch (geocodeError) {
        console.error('Error geocoding address:', geocodeError);
        // Continue without coordinates if geocoding fails
      }
    }
    
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
// Search properties using text search
exports.searchProperties = async (req, res) => {
  try {
    const { 
      query, propertyType, minPrice, maxPrice, bedrooms, city,
      district, microdistrict, floor, minArea, maxArea,
      minLandArea, maxLandArea, buildingClass, wallMaterial,
      separateBathroom, parking, paymentPeriod
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add text search if query parameter is provided
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Add other filters
    if (propertyType) filter.propertyType = propertyType;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (district) filter['location.district'] = { $regex: district, $options: 'i' };
    if (microdistrict) filter['location.microdistrict'] = { $regex: microdistrict, $options: 'i' };
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    
    // Price filtering
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseInt(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseInt(maxPrice);
    }
    
    // Payment period
    if (paymentPeriod) filter['price.paymentPeriod'] = paymentPeriod;
    
    // Area filters
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseInt(minArea);
      if (maxArea) filter.area.$lte = parseInt(maxArea);
    }
    
    // Land area filters (for houses)
    if (minLandArea || maxLandArea) {
      filter['areaDetails.landArea'] = {};
      if (minLandArea) filter['areaDetails.landArea'].$gte = parseInt(minLandArea);
      if (maxLandArea) filter['areaDetails.landArea'].$lte = parseInt(maxLandArea);
    }
    
    // Building details
    if (floor) filter['buildingDetails.floor'] = parseInt(floor);
    if (buildingClass) filter['buildingDetails.buildingClass'] = buildingClass;
    if (wallMaterial) filter['buildingDetails.wallMaterial'] = wallMaterial;
    
    // Facilities
    if (separateBathroom) filter['facilities.separateBathroom'] = separateBathroom === 'true';
    if (parking) filter['facilities.parking'] = parking === 'true';

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
// Get properties for the logged-in landlord
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).populate('owner', 'name email');
    
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