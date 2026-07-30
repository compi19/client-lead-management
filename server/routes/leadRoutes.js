const express = require('express');
const router = express.Router();

// Ensure 'updateLead' is correctly imported from the controller
const { createLead, getLeads, updateLead, deleteLead } = require('../controllers/leadController');

/**
 * Lead Management Routes
 */
router.post('/', createLead);      // Create a new lead
router.get('/', getLeads);         // Fetch all leads
router.put('/:id', updateLead);    // Update a specific lead by ID
router.delete('/:id', deleteLead); // Delete a specific lead by ID

module.exports = router;