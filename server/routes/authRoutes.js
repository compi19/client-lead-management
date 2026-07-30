const express = require('express');
const router = express.Router();

// Ensure both login and register are correctly imported from the controller
const { login, register } = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Private (Typically Admin only)
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', login);

module.exports = router;