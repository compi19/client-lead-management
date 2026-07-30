const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Admin', 'Employee'], 
    default: 'Employee' 
  }
}, { timestamps: true });

/**
 * Note: The .pre('save') middleware for password hashing was removed from here 
 * because hashing is currently handled within the controller logic.
 */

module.exports = mongoose.model('User', userSchema);