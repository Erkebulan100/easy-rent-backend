const User = require('../models/user.model');
const uploadService = require('../services/upload.service');
// Update own profile
exports.updateProfile = async (req, res) => {
  try {
    console.log('Update profile request body:', req.body); // Add this line
    // Prevent updating role through this endpoint
    if (req.body.role) {
      delete req.body.role;
    }
    
    // Prevent updating password through this endpoint
    // Password should be updated through a separate endpoint with verification
    if (req.body.password) {
      delete req.body.password;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    console.log('Updated user:', user);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get own profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
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
// Upload avatar
// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    console.log('Avatar upload initiated for user:', req.user._id);
    
    if (!req.file) {
      console.log('No file provided in the request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    console.log('File details:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.buffer.length
    });
    
    // Upload the file using our upload service
    console.log('Calling uploadFile service...');
    const fileUrl = await uploadService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'avatars'
    );
    console.log('File uploaded successfully, URL:', fileUrl);
    
    // Update the user's avatar field
    console.log('Updating user document with avatar URL');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: fileUrl },
      { new: true }
    ).select('-password');
    
    console.log('User updated with avatar:', user);
    
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Avatar upload error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};