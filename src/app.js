const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes'); // Add this line
const locationRoutes = require('./routes/location.routes');
const messageRoutes = require('./routes/message.routes');
const aiRoutes = require('./routes/ai.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Easy-Rent API' });
});

// Routes will be added here later
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes); // Add this line
app.use('/api/location', locationRoutes);
module.exports = app;
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/uploads', uploadRoutes);