const Contact = require('../models/Contact'); // Get the Contact blueprint

// @desc    Create new contact submission
// @route   POST /api/contact
const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newSubmission = new Contact({
      name,
      email,
      message,
    });

    await newSubmission.save();
    res.status(201).json({ message: 'Message received! We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving message. Please try again.' });
  }
};

module.exports = { submitContactForm };
