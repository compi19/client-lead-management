const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * 1. Register a new user
 * This function is used to register new users through the Admin Dashboard.
 */
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "This user is already registered! ❌" });
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    user = new User({
      username,
      password: hashedPassword,
      role: role || 'Employee' // Defaults to 'Employee' if no role is provided
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully! ✅" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};

/**
 * 2. User Login
 * Authenticates user and returns a token along with their assigned role.
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });
    
    // Validate existence and password match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password! ❌" });
    }

    // Sign the JWT token including User ID and Role
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Return necessary auth data to the frontend
    res.json({ 
      token, 
      username: user.username, 
      role: user.role // Used by frontend to determine dashboard view
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};