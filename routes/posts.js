const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create post

router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (!user) {
      res.status(400).json({ msg: "invalid User! cannot post" });
    }
    const post = await newPost.save();

    res.status(200).json({ msg: "post created successfuly", post });
  } catch (error) {
    res.status(500).json({ msg: "error from post / in blog", error });
  }
});

// get all post
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catname = req.query.cat;
  try {
    if (username) {
      const posts = await Post.find({ username });
      res.status(200).json({ posts });
    } else if (catname) {
      const posts = await Post.find({
        categories: {
          $in: [catname],
        },
      });
      res.status(200).json({ posts });
    } else {
      const posts = await Post.find({});
      res.status(200).json({ posts });
    }
  } catch (error) {
    res.status(500).json({ msg: "error from get / in blog", error });
  }
});

// get post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      res.status(400).json({ msg: "invalid post id" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ msg: "error from get /:id in blog", error });
  }
});

// update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json({ msg: "Post updated successfully", updatedPost });
    } else {
      res.status(401).json({ msg: "unauthorized! cannot update post" });
    }
  } catch (error) {
    res.status(500).json({ msg: "error from put /:id in blog", error });
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "delete successfull" });
    } else {
      res.status(401).json({ msg: "Unauthorize! cannot delete post" });
    }
  } catch (error) {
    res.status(500).json({ msg: "error from delete /:id in blog", error });
  }
});

module.exports = router;
