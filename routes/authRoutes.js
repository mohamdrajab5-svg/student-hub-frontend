// Add these imports at the top
const crypto = require('crypto'); // Built-in Node.js package
const User = require('../models/User'); // Adjust path if needed
const sendEmail = require('../utils/sendEmail'); // The file we just made
const express = require('express');
const router = express.Router();
// Import our controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// Define the routes
// When a POST request comes to /api/auth/register, use registerUser
router.post('/register', registerUser);

// When a POST request comes to /api/auth/login, use loginUser
router.post('/login', loginUser);
// --- ADD THESE TWO NEW ROUTES ---

// 1. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  // 1) Find user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // We don't want to tell them the user doesn't exist (security)
    // We just say "if a user exists, an email has been sent"
    return res.status(200).json({ message: 'Email sent.' });
  }

  // 2) Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 3) Hash token and save it to user model
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 4) Set token to expire in 10 minutes
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // 5) Create the reset URL for the frontend
  //    This is the URL to the new page we will build
  const resetURL = `https://mohamdrajab5-svg.github.io/the-web/reset-password.html?token=${resetToken}`;

  // 6) Create the email message
  const message = `Forgot your password? Submit a PUT request with your new password to: \n\n ${resetURL} \n\nIf you didn't forget your password, please ignore this email.`;

  // 7) Send the email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    console.error('EMAIL ERROR:', err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(500).json({ message: 'Error sending email. Please try again.' });
  }
});

// 2. RESET PASSWORD
router.put('/reset-password/:token', async (req, res) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2) Find the user by the hashed token and check if it's expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // $gt = "greater than" now
  });

  // 3) If token is invalid or expired
  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired' });
  }

  // 4) Set the new password
  user.password = req.body.password; // The auth logic will hash this on save
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 5) Send success response
  res.status(200).json({ message: 'Password reset successfully!' });
});

// --- END OF NEW ROUTES ---
module.exports = router;
