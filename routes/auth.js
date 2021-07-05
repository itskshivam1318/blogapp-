const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

//Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();

    res.status(200).json({ msg: "user created successfully", user: user });
  } catch (error) {
    res.status(500).json({
      msg: `Problem in /register route `,
      error: error,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json({ msg: "Wrong Credentials" });

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(401).json({ msg: "Wrong Credentials" });

    const { password, ...otherDetails } = user._doc;

    res.status(200).json({ msg: "Login successfull", user: otherDetails });
  } catch (error) {
    res.status(500).json({ msg: "error in /login", error: error });
  }
});

module.exports = router;
