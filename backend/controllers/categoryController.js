const Category = require("../models/Category");

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

    // 🔥 duplicate check (case-insensitive)
    const existing = await Category.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // 🔥 image handle
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


// ================= GET ALL =================
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