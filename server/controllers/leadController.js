const Lead = require('../models/Lead');

// 1. Register a new lead (Create)
exports.createLead = async (req, res) => {
  try {
    const newLead = await Lead.create(req.body);
    res.status(201).json(newLead);
  } catch (error) {
    // Handling MongoDB Duplicate Key Error (Error Code 11000)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      let fieldName = duplicateField === 'phone' ? 'phone number' : 'email';
      return res.status(400).json({ 
        message: `This ${fieldName} is already registered! Duplicate entries are not allowed. ❌` 
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// 2. Fetch all leads (Read)
exports.getLeads = async (req, res) => {
  try {
    // Sorting by newest first
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch data", error: error.message });
  }
};

// 3. Update lead information (Update)
exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    );
    
    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(updatedLead);
  } catch (error) {
    // Prevent duplicates during the update process
    if (error.code === 11000) {
      return res.status(400).json({ message: "The phone or email you provided is already in use by another lead! ❌" });
    }
    res.status(400).json({ message: error.message });
  }
};

// 4. Delete a lead 
exports.deleteLead = async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};