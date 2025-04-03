const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['tenant', 'landlord', 'admin'],
    default: 'tenant'
  },
  // We'll add the gender field here
  gender: {
    type: String,
    enum: ['male', 'female'], 
    required: true // Make it a required field
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  phoneNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Optional: Add a phone number validation regex if needed
        // This is a simple example that allows international format
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;