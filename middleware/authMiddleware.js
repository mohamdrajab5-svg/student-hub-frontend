const jwt = require('jsonwebtoken');
const User = require('../models/User'); // We need the User model to find the user

const protect = async (req, res, next) => {
  let token;

  // Check if the token was sent in the 'Authorization' header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGciOiJI...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the token's ID and attach them to the request
      // We exclude the password when fetching the user
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move on to the next function (the controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
