const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getPosts).post(protect, createPost);
router
  .route("/:id")
  .get(protect, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);
router.put("/:id/like", protect, toggleLikePost);

module.exports = router;
