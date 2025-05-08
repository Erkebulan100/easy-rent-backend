const Property = require('../models/property.model');
const mapsService = require('../services/maps.service');
const uploadService = require('../services/upload.service');
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
// Create a new property
exports.createProperty = async (req, res) => {
  try {
    // ADD THESE LINES FOR DEBUGGING
    console.log('=== CREATE PROPERTY REQUEST DEBUG ===');
    console.log('req.files:', req.files);
    console.log('req.file:', req.file);
    console.log('req.body.images:', req.body.images);
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('===================================');
    // Process uploaded files
if (req.files && req.files.length > 0) {
  console.log('Processing uploaded files...');
  const processedImages = [];
  
  for (const file of req.files) {
    try {
      console.log(`Uploading file: ${file.originalname}`);
      const fileUrl = await uploadService.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        'properties'
      );
      processedImages.push(fileUrl);
      console.log(`File uploaded successfully: ${fileUrl}`);
    } catch (uploadError) {
      console.error(`Failed to upload file: ${file.originalname}`, uploadError);
    }
  }
  
  // Add uploaded image URLs to the request body
  req.body.images = processedImages;
  console.log('Final images array:', req.body.images);
}
    // Add owner from authenticated user
    req.body.owner = req.user._id;
    
    // Process images - extract only the URLs
let processedImages = [];

// The frontend is sending image data as arrays with [file] and [url] properties
// We need to extract just the string URLs
if (req.body.images) {
  // First check if images is already an array of strings
  if (Array.isArray(req.body.images)) {
    processedImages = req.body.images.filter(img => typeof img === 'string' && !img.startsWith('blob:'));
  } else {
    // Check if images are being sent as separate form fields
    for (let i = 0; i < 20; i++) { // Limit to reasonable number
      const imageUrl = req.body[`images[${i}][url]`];
      if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('blob:')) {
        processedImages.push(imageUrl);
      }
    }
  }
  
  // Replace the images array with processed URLs
  req.body.images = processedImages;
}
    
    // Ensure required numeric fields are properly converted
    if (req.body.bedrooms) req.body.bedrooms = Number(req.body.bedrooms);
    if (req.body.bathrooms) req.body.bathrooms = Number(req.body.bathrooms);
    if (req.body.area) req.body.area = Number(req.body.area);
    
    // If location fields are sent as separate form fields, restructure them
    if (req.body['location[address]']) {
      req.body.location = {
        ...(req.body.location || {}),
        address: req.body['location[address]'],
        city: req.body['location[city]'],
        district: req.body['location[district]'],
        microdistrict: req.body['location[microDistrict]']
      };
      
      // Handle coordinates
      if (req.body['location[lat]'] && req.body['location[lng]']) {
        req.body.location.coordinates = {
          latitude: Number(req.body['location[lat]']),
          longitude: Number(req.body['location[lng]'])
        };
      }
    }
    
    // Handle price if sent as separate form fields
    if (req.body['price[amount]']) {
      req.body.price = {
        ...(req.body.price || {}),
        amount: Number(req.body['price[amount]']),
        currency: req.body['price[currency]'],
        paymentPeriod: req.body['price[paymentPeriod]']
      };
    }
    
    // If amenities are sent as separate form fields, reconstruct the array
    let amenities = [];
    for (let i = 0; i < 20; i++) {
      if (req.body[`amenities[${i}]`]) {
        amenities.push(req.body[`amenities[${i}]`]);
      }
    }
    if (amenities.length > 0) {
      req.body.amenities = amenities;
    }
    
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
    
    console.log('Property data before creation:', JSON.stringify(req.body, null, 2));
    const property = await Property.create(req.body);
    
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
      stack: error.stack, // This will show the full error stack trace
      body: req.body // This will show what was sent in the request
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