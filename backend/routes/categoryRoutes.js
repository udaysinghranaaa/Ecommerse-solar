const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const categoryController = require("../controllers/categoryController");
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

// ================= DEBUG =================
router.get("/test", (req, res) => {
  console.log("✅ CATEGORY ROUTE WORKING");
  res.send("Category Route OK");
});

// ================= CREATE CATEGORY =================
// 🔒 admin + image upload
router.post("/", auth, upload.single("image"), categoryController.createCategory);

// ================= GET ALL =================
router.get("/", categoryController.getCategories);

module.exports = router;