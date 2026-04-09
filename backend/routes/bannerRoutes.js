const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ✅ IMPORT CONTROLLERS
const {
  createBanner,
  getBanners,
  deleteBanner, // 🔥 NEW
} = require("../controllers/bannerController");

// ✅ MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ================= ROUTES =================

// 🔹 CREATE BANNER
router.post("/", upload.single("image"), createBanner);

// 🔹 GET ALL BANNERS
router.get("/", getBanners);

// 🔥 DELETE BANNER (IMPORTANT)
router.delete("/:id", deleteBanner);

// ==========================================

module.exports = router;