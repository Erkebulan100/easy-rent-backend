const AWS = require('aws-sdk');
const config = require('./config');

// Configure AWS
AWS.config.update({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion
});

// Create S3 service object
const s3 = new AWS.S3();

module.exports = s3;