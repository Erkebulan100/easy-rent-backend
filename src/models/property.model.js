const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'studio', 'room']
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      trim: true
    },
    microdistrict: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentPeriod: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'monthly'
    }
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  // General area (used by both apartment and house)
  area: {
    type: Number, // square meters
    required: true
  },
  // Additional detailed area information
  areaDetails: {
    livingSpace: Number, // square meters (for apartments)
    kitchenArea: Number, // square meters
    landArea: Number,    // square meters (for houses)
  },
  // Building characteristics
  buildingDetails: {
    floor: Number,       // for apartments
    totalFloors: Number, // total floors in the building
    ceilingHeight: Number, // meters
    wallMaterial: {
      type: String,
      enum: ['brick', 'monoblock', 'gas block', 'wood', 'concrete', 'other']
    },
    buildingClass: {
      type: String,
      enum: ['standard', 'comfort', 'business', 'elite', 'premium', 'economy']
    },
    yearBuilt: Number
  },
  // Facilities
  facilities: {
    separateBathroom: {
      type: Boolean,
      default: false
    },
    parking: {
      type: Boolean,
      default: false
    },
    parkingDetails: String, // Underground, dedicated spot, etc.
  },
  amenities: [String],
  images: [String], // URLs to images
  available: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for search functionality
propertySchema.index(
  { 
    title: 'text', 
    description: 'text', 
    'location.address': 'text',
    'location.city': 'text',
    'location.district': 'text',
    'location.microdistrict': 'text'
  },
  {
    weights: {
      title: 10,
      description: 5,
      'location.address': 7,
      'location.city': 8,
      'location.district': 6,
      'location.microdistrict': 6
    },
    name: "PropertySearchIndex"
  }
);

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;