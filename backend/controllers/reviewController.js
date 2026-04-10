const Review = require("../models/Review");
const fs = require("fs");
const path = require("path");

// ================= CREATE =================
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
    console.error("CREATE REVIEW ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET =================
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("GET REVIEW ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting Review ID:", id);

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // 🔥 Delete image safely
    if (review.image) {
      const filePath = path.join(__dirname, "..", review.image);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("🧹 Image deleted");
        }
      } catch (err) {
        console.log("⚠️ Image delete skipped:", err.message);
      }
    }

    await Review.findByIdAndDelete(id);

    res.json({ message: "✅ Review deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE REVIEW ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};