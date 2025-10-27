const express = require('express');
const router = express.Router();
// Import our controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// Define the routes
// When a POST request comes to /api/auth/register, use registerUser
router.post('/register', registerUser);

// When a POST request comes to /api/auth/login, use loginUser
router.post('/login', loginUser);

module.exports = router;
