const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createReview,
  getReviews,
  deleteReview // 🔥 ADD THIS
} = require("../controllers/reviewController");

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= CREATE REVIEW =================
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    console.log("👉 Incoming Review Request");

    const token = req.headers.authorization;
    if (!token) {
      console.log("❌ No Token");
    }

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    return createReview(req, res);
  } catch (err) {
    console.error("❌ ROUTE ERROR:", err);
    next(err);
  }
});

// ================= GET ALL REVIEWS =================
router.get("/", getReviews);

// 🔥 DELETE REVIEW (IMPORTANT)
router.delete("/:id", deleteReview);

module.exports = router;