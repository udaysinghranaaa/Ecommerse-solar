const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ✅ IMPORT CONTROLLERS
const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getTrendingProducts,
  getFeaturedProducts,
  getSubsidyProducts, // 🔥 NEW
} = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");

// ✅ MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ================= ROUTES =================

// 🔥 IMPORTANT: Specific routes FIRST

// ✅ CATEGORY PRODUCTS
router.get("/category/:id", getProductsByCategory);

// 🔥 TRENDING
router.get("/trending", getTrendingProducts);

// ❤️ FEATURED
router.get("/featured", getFeaturedProducts);

// 🟢 SUBSIDY PRODUCTS (NEW)
router.get("/subsidy", getSubsidyProducts);

// ================= NORMAL =================

// GET ALL
router.get("/", getProducts);

// GET SINGLE
router.get("/:id", getSingleProduct);

// CREATE
router.post("/", auth, upload.array("images", 5), createProduct);

// UPDATE
router.put("/:id", auth, upload.array("images", 5), updateProduct);

// DELETE
router.delete("/:id", auth, deleteProduct);

module.exports = router;