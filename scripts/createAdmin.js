require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const config = require('../src/config/config');

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@easyrent.com',
  password: 'Admin123!',  // This will be hashed by the pre-save hook in the User model
  role: 'admin'
};

// Connect to the database
mongoose.connect(config.mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminUser.email });
      
      if (existingAdmin) {
        console.log('Admin user already exists');
      } else {
        // Create admin user
        const user = new User(adminUser);
        await user.save();
        console.log('Admin user created successfully');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
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