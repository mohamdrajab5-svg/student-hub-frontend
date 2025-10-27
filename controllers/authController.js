const User = require('../models/User'); // Gets our User blueprint
const jwt = require('jsonwebtoken'); // To make the "login token"

// Helper function to create a token
const generateToken = (id) => {
  // process.env.JWT_SECRET is a secret password we'll add to our .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will expire in 30 days
  });
};

// --- REGISTER USER ---
// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body; // Get data from the frontend

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. If not, create new user
    const user = await User.create({
      name,
      email,
      password, // Password will be auto-hashed by the code in User.js!
    });

    // 3. Send back user data and a token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// --- LOGIN USER ---
// @desc    Authenticate (log in) a user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Get data from the frontend

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. If user exists, check password
    // We need to create the 'matchPassword' method in our User.js model
    if (user && (await user.matchPassword(password))) {
      // 3. Send back user data and a token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// We must export the functions to use them in other files
module.exports = { registerUser, loginUser };
