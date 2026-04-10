const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

// ================= CREATE =================
exports.createCategory = async (req, res) => {
  try {
    const name = req.body?.name;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name required",
      });
    }

    const existing = await Category.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path;
    }

    const category = await Category.create({
      name,
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });

  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET =================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      categories: categories || [],
    });

  } catch (err) {
    console.error("GET CATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
      categories: [],
    });
  }
};

// 🔥 ================= DELETE =================
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 🔥 delete image safely
    if (category.image) {
      const filePath = path.join(__dirname, "..", category.image);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("🧹 Category image deleted");
        }
      } catch (err) {
        console.log("⚠️ Image delete skipped:", err.message);
      }
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "✅ Category deleted successfully",
    });

  } catch (err) {
    console.error("DELETE CATEGORY ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};