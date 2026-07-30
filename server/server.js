const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const leadRoutes = require('./routes/leadRoutes');
const authRoutes = require('./routes/authRoutes'); 
const User = require('./models/User'); // Required for user management logic
const bcrypt = require('bcryptjs');

dotenv.config();

// 1. Database Connection
connectDB(); 

// 2. Sync Database Indexes
// This ensures that 'unique' constraints (like phone/email) are properly applied
mongoose.connection.once('open', () => {
  console.log('MongoDB connection established. Syncing indexes...');
  const Lead = require('./models/Lead');
  Lead.syncIndexes().then(() => {
    console.log('Indexes synced successfully ✅');
  }).catch(err => console.error('Index sync error ❌:', err));
});

const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Routes
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);

/**
 * --- Temporary Password Fix Route ---
 * SECURITY NOTE: You should delete or comment out this route after 
 * your first successful login in the development environment.
 */
app.get('/fix-login', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Find the 'admin' user and update password, or create if they don't exist
    await User.findOneAndUpdate(
      { username: 'admin' }, 
      { password: hashedPassword }, 
      { upsert: true, new: true }
    );
    res.send("Password fix applied! You can now log in using 'admin' and 'admin123'. ✅");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
// ---------------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));