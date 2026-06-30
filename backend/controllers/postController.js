const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      res.status(400);
      throw new Error("Post content cannot be empty");
    }

    const post = await Post.create({
      content,
      author: req.user._id,
    });

    const populatedPost = await post.populate("author", "name profilePicture");

    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (feed), newest first
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single post by id
// @route   GET /api/posts/:id
// @access  Private
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name profilePicture"
    );
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Update own post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to edit this post");
    }

    post.content = req.body.content ?? post.content;
    const updatedPost = await post.save();
    const populatedPost = await updatedPost.populate("author", "name profilePicture");

    res.json(populatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this post");
    }

    await post.deleteOne();
    res.json({ message: "Post removed", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Like or unlike a post (toggle)
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    const populatedPost = await post.populate("author", "name profilePicture");

    res.json(populatedPost);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
};
