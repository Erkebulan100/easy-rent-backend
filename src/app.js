const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const locationRoutes = require('./routes/location.routes');
const messageRoutes = require('./routes/message.routes');
const aiRoutes = require('./routes/ai.routes');
const uploadRoutes = require('./routes/upload.routes');
const swaggerDocs = require('./config/swagger');

const app = express();

// Middleware
app.use(helmet());

// CORS configuration - use specific origin in production
if (config.nodeEnv === 'production') {
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
} else {
  // Development - allow all origins
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Easy-Rent API',
    environment: config.nodeEnv,
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/uploads', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: config.nodeEnv === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Setup Swagger
swaggerDocs(app);

module.exports = app;