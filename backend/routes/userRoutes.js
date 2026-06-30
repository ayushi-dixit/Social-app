const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.put("/me", protect, updateUserProfile);
router.get("/:id", protect, getUserProfile);

module.exports = router;
