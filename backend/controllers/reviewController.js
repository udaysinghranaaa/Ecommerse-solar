const Review = require("../models/Review");

// CREATE
exports.createReview = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    const review = await Review.create({
      name,
      message,
      rating,
      image: req.file ? req.file.path : "",
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};