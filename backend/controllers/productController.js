const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// 🔥 COMMON FILTER (IMPORTANT FIX)
const activeFilter = {
  $or: [{ isActive: true }, { isActive: { $exists: false } }],
};

// ================= CREATE =================
exports.createProduct = async (req, res) => {
  try {
    if (!req.body.title || !req.body.category) {
      return res.status(400).json({
        message: "Title and Category are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const imagePaths =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      mrpPrice: Number(req.body.mrpPrice),
      discountPrice: Number(req.body.discountPrice),
      gst: Number(req.body.gst),
      stock: Number(req.body.stock),
      category: req.body.category,
      images: imagePaths,

      // FLAGS
      isTrending: req.body.isTrending === "true" || req.body.isTrending === true,
      isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
      isSubsidy: req.body.isSubsidy === "true" || req.body.isSubsidy === true,

      // 🔥 DEFAULT FIX
      isActive: true,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Product creation failed",
      error: err.message,
    });
  }
};

// ================= GET ALL =================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find(activeFilter).populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ONE =================
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE =================
exports.updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (
      updateData.category &&
      !mongoose.Types.ObjectId.isValid(updateData.category)
    ) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    if (updateData.isTrending !== undefined) {
      updateData.isTrending =
        updateData.isTrending === "true" || updateData.isTrending === true;
    }

    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured =
        updateData.isFeatured === "true" || updateData.isFeatured === true;
    }

    if (updateData.isSubsidy !== undefined) {
      updateData.isSubsidy =
        updateData.isSubsidy === "true" || updateData.isSubsidy === true;
    }

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CATEGORY =================
exports.getProductsByCategory = async (req, res) => {
  try {
    const param = req.params.id;

    let category;

    if (mongoose.Types.ObjectId.isValid(param)) {
      category = await Category.findById(param);
    } else {
      category = await Category.findOne({ slug: param });
    }

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({
      category: category._id,
      ...activeFilter,
    }).populate("category");

    res.json(products);
  } catch (err) {
    console.error("❌ CATEGORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= TRENDING =================
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isTrending: true,
      ...activeFilter,
    }).populate("category");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= FEATURED =================
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      ...activeFilter,
    }).populate("category");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= SUBSIDY =================
exports.getSubsidyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isSubsidy: true,
      ...activeFilter,
    }).populate("category");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};