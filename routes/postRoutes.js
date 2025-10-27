const express = require('express');
const router = express.Router();
const { getPosts, createPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware'); // Get the gatekeeper

// @route /api/posts

// Anyone can GET posts
router.route('/').get(getPosts);

// Only logged-in users (protected) can POST new posts
router.route('/').post(protect, createPost); 

module.exports = router;
