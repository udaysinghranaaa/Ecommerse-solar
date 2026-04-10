const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ✅ IMPORT CONTROLLERS
const {
  createStory,
  getStories,
  deleteStory // 🔥 ADD THIS
} = require("../controllers/storyController");

// ✅ MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ================= ROUTES =================

// CREATE
router.post("/", upload.single("image"), createStory);

// GET
router.get("/", getStories);

// 🔥 DELETE (IMPORTANT)
router.delete("/:id", deleteStory);

// ==========================================

module.exports = router;