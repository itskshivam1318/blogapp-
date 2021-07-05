const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({ msg: "user updated sucessfully.", updatedUser });
    } catch (error) {
      res.status(500).json({ msg: "error from put /:id", error: error });
    }
  } else {
    res
      .status(401)
      .json({ msg: "Unauthorized! you can update only your account." });
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        try {
          await Post.deleteMany({ username: user.username });
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json({ msg: "delete Successfull." });
        } catch (error) {
          res.send(500).json({ msg: "error from delete /:id", error });
        }
      } else {
        res.status(404).json({ msg: "User doesnot exist." });
      }
    } catch (error) {
      res.status(500).json({ msg: "Problem in getting user." });
    }
  } else {
    res
      .status(401)
      .json({ msg: "Unauthorized! you can only delete your account." });
  }
});

// Get User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json({ user: otherDetails });
    } else {
      res.status(404).json({ msg: "User doesnot exists." });
    }
  } catch (error) {
    res.status(500).json({ msg: "error from get /:id", error });
  }
});

module.exports = router;
