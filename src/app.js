const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes'); // Add this line

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

module.exports = app;