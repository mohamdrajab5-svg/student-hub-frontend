const Post = require('../models/Post'); // Get the Post blueprint

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    // Find all posts and also include the 'name' of the user who posted it
    const posts = await Post.find({}).populate('user', 'name'); 
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
const createPost = async (req, res) => {
  const { title, body, category } = req.body;

  try {
    const post = new Post({
      title,
      body,
      category,
      user: req.user._id, // req.user comes from our 'protect' middleware!
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = { getPosts, createPost };
