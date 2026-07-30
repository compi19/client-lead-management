const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: true,
    unique: true, // Prevents duplicate phone numbers in the database
    index: true,
    trim: true 
  },
  email: { 
    type: String,
    unique: true, // Prevents duplicate email addresses
    sparse: true, // Allows registration for users without an email while preventing null index errors
    index: true,
    trim: true,
    default: '' 
  },
  source: { 
    type: String, 
    default: 'Facebook' 
  },
  status: { 
    type: String, 
    default: 'New' 
  },
  note: { 
    type: String,
    default: ''
  }
}, { timestamps: true });

// Checks if the model already exists before creating a new one to prevent overwrite errors
module.exports = mongoose.models.Lead || mongoose.model('Lead', leadSchema);