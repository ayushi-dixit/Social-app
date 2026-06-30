const User = require("../models/User");

// @desc    Get user profile by id
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged in user's profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.name = req.body.name ?? user.name;
    user.bio = req.body.bio ?? user.bio;
    if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile };
