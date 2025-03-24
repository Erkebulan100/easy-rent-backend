const s3 = require('../config/s3.config');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload a file to AWS S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} fileType - File MIME type
 * @param {string} folder - Folder to store the file in (e.g., 'properties', 'documents')
 * @returns {Promise<string>} - URL of the uploaded file
 */
const uploadFile = async (fileBuffer, fileName, fileType, folder = 'properties') => {
  // Generate a unique filename to prevent collisions
  const fileExtension = fileName.split('.').pop();
  const uniqueFileName = `${folder}/${uuidv4()}.${fileExtension}`;
  
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: fileType,
    ACL: 'public-read' // Make the file publicly accessible
  };
  
  try {
    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location; // Return the URL of the uploaded file
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Delete a file from AWS S3
 * @param {string} fileUrl - URL of the file to delete
 * @returns {Promise<void>}
 */
const deleteFile = async (fileUrl) => {
  // Extract the key from the file URL
  const key = fileUrl.split('/').slice(3).join('/');
  
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  };
  
  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

module.exports = {
  uploadFile,
  deleteFile
};