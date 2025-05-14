require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const config = require('../src/config/config');

// Connect to the database
mongoose.connect(config.mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find admin user
      const adminUser = await User.findOne({ email: 'admin@easyrent.com' });
      
      if (!adminUser) {
        console.log('Admin user not found');
      } else {
        // Update admin password
        adminUser.password = 'Admin123!';  // This will be hashed by the pre-save hook
        await adminUser.save();
        console.log('Admin password updated successfully');
        console.log('Admin email:', adminUser.email);
      }
    } catch (error) {
      console.error('Error updating admin password:', error);
    } finally {
      // Disconnect from the database
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });