const express = require('express');
const propertyController = require('../controllers/property.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

// Get all properties (public access)
router.get('/', propertyController.getAllProperties);
// Search properties (public access)
router.get('/search', propertyController.searchProperties);
// Get a single property (public access)
router.get('/:id', propertyController.getPropertyById);

// Create a property (requires authentication - only landlords)
router.post('/', auth, (req, res, next) => {
  if (req.user.role !== 'landlord' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Only landlords can create property listings' 
    });
  }
  next();
}, propertyController.createProperty);

// Update a property (requires authentication - owner or admin only)
router.put('/:id', auth, propertyController.updateProperty);

// Delete a property (requires authentication - owner or admin only)
router.delete('/:id', auth, propertyController.deleteProperty);

module.exports = router;