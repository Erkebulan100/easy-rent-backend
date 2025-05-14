require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const config = require('../src/config/config');

// Connect to the database
mongoose.connect(config.mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find all users
      const users = await User.find().select('name email role');
      
      console.log('Users in the database:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}), Role: ${user.role}`);
      });
      
      // Count by role
      const admins = users.filter(u => u.role === 'admin').length;
      const landlords = users.filter(u => u.role === 'landlord').length;
      const tenants = users.filter(u => u.role === 'tenant').length;
      
      console.log('\nUser statistics:');
      console.log(`- Total users: ${users.length}`);
      console.log(`- Admins: ${admins}`);
      console.log(`- Landlords: ${landlords}`);
      console.log(`- Tenants: ${tenants}`);
      
    } catch (error) {
      console.error('Error listing users:', error);
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