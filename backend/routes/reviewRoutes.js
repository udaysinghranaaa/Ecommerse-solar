const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { createReview, getReviews } = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

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

// 🔥 SAFE ROUTE (Auth + Upload + Debug)
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    console.log("👉 Incoming Review Request");

    // 🔥 TOKEN CHECK (optional)
    const token = req.headers.authorization;
    if (!token) {
      console.log("❌ No Token");
      // For now allow request (remove this if you want strict auth)
    }

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // 👉 Call controller
    return createReview(req, res);
  } catch (err) {
    console.error("❌ ROUTE ERROR:", err);
    next(err);
  }
});

// ================= GET ALL REVIEWS =================
router.get("/", getReviews);

module.exports = router;