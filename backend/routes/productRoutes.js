console.log("🔥 BACKEND ROUTE UPDATED FINAL");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ SAFE IMPORT (FULL CONTROLLER)
const controller = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");

// ✅ MULTER CONFIG (FIXED FOR RENDER)
const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ================= ROUTES =================

// ✅ SPECIAL ROUTES (ALWAYS FIRST)

// CATEGORY
if (typeof controller.getProductsByCategory === "function") {
  router.get("/category/:id", controller.getProductsByCategory);
}

// TRENDING
if (typeof controller.getTrendingProducts === "function") {
  router.get("/trending", controller.getTrendingProducts);
}

// FEATURED
if (typeof controller.getFeaturedProducts === "function") {
  router.get("/featured", controller.getFeaturedProducts);
}

// SUBSIDY
if (typeof controller.getSubsidyProducts === "function") {
  router.get("/subsidy", controller.getSubsidyProducts);
}

// ================= NORMAL =================

// GET ALL
router.get("/", controller.getProducts);

// ❗ IMPORTANT: KEEP THIS LAST (to avoid route conflict)
router.get("/:id", controller.getSingleProduct);

// CREATE
router.post(
  "/",
  auth,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  controller.createProduct
);

// UPDATE
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  controller.updateProduct
);

// DELETE
router.delete("/:id", auth, controller.deleteProduct);

module.exports = router;