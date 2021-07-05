const router = require("express").Router();
const Category = require("../models/Category");

router.post("/", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const category = await newCategory.save();
    res.status(200).json({ msg: "category added", category });
  } catch (error) {
    res.status(500).json({ msg: "error in post / in category" });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ msg: "error in get / in category" });
  }
});

module.exports = router;
