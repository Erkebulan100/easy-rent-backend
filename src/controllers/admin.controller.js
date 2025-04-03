const User = require('../models/user.model');
const Property = require('../models/property.model');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    // Prevent updating password through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get dashboard stats (admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const tenantCount = await User.countDocuments({ role: 'tenant' });
    const landlordCount = await User.countDocuments({ role: 'landlord' });
    const propertyCount = await Property.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        userCount,
        tenantCount,
        landlordCount,
        propertyCount
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