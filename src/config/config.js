const config = {
    // Server configuration
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // MongoDB configuration
    mongoURI: process.env.MONGODB_URI,
    
    // JWT configuration
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    
    // AWS configuration
    awsRegion: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketName: process.env.S3_BUCKET_NAME,
    
    // OpenAI configuration
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiProjectId: process.env.OPENAI_PROJECT_ID,
    
    // Google Maps configuration
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    
    // CORS configuration
    corsOrigin: process.env.CORS_ORIGIN || '*'
  };
  
  module.exports = config;