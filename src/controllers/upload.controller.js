const uploadService = require('../services/upload.service');

// Upload a property image
exports.uploadPropertyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const fileUrl = await uploadService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'properties'
    );
    
    res.status(200).json({
      success: true,
      data: {
        fileUrl
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

// Upload a user document
exports.uploadUserDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const fileUrl = await uploadService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'documents'
    );
    
    res.status(200).json({
      success: true,
      data: {
        fileUrl
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

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'File URL is required'
      });
    }
    
    await uploadService.deleteFile(fileUrl);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};