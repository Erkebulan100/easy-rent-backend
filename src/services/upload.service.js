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
  try {
    // Log environment variables (redacted for security)
    console.log('S3 Configuration:');
    console.log('- Bucket name exists:', !!process.env.S3_BUCKET_NAME);
    console.log('- AWS region:', process.env.AWS_REGION);
    console.log('- AWS credentials exist:', !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY);
    
    // Generate a unique filename to prevent collisions
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${folder}/${uuidv4()}.${fileExtension}`;
    
    console.log('Uploading file:', {
      fileName: fileName,
      fileType: fileType,
      uniqueFileName: uniqueFileName,
      fileSize: fileBuffer.length,
      bucketName: process.env.S3_BUCKET_NAME
    });
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: fileType
    };
    
    console.log('Initiating S3 upload with params:', {
      Bucket: params.Bucket,
      Key: params.Key,
      ContentType: params.ContentType
    });
    
    const uploadResult = await s3.upload(params).promise();
    console.log('S3 upload successful:', uploadResult.Location);
    return uploadResult.Location; // Return the URL of the uploaded file
  } catch (error) {
    console.error('S3 upload error details:', {
      message: error.message,
      code: error.code,
      requestId: error.requestId,
      statusCode: error.statusCode,
      time: error.time,
      stack: error.stack
    });
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Delete a file from AWS S3
 * @param {string} fileUrl - URL of the file to delete
 * @returns {Promise<void>}
 */
const deleteFile = async (fileUrl) => {
  try {
    // Extract the key from the file URL
    const key = fileUrl.split('/').slice(3).join('/');
    
    console.log('Deleting file from S3:', {
      fileUrl: fileUrl,
      extractedKey: key,
      bucketName: process.env.S3_BUCKET_NAME
    });
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    console.log('File deleted successfully from S3');
  } catch (error) {
    console.error('S3 delete error details:', {
      message: error.message,
      code: error.code,
      requestId: error.requestId,
      statusCode: error.statusCode,
      time: error.time,
      stack: error.stack
    });
    throw new Error('Failed to delete file from S3');
  }
};

module.exports = {
  uploadFile,
  deleteFile
};