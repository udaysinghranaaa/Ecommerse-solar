const Category = require("../models/Category");

// ================= CREATE =================
exports.createCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);   // 🔥 debug
    console.log("FILE:", req.file);   // 🔥 debug

    // ❌ OLD (remove)
    // const { name } = req.body;

    // ✅ SAFE WAY
    const name = req.body?.name;

    if (!name) {
      return res.status(400).json({ message: "Category name required" });
    }

    // 🔥 duplicate check
    const existing = await Category.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") },
    });

    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // 🔥 IMAGE HANDLE
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path;
    }

    const category = await Category.create({
      name,
      image: imagePath,
    });

    res.status(201).json(category);

  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL =================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error("GET CATEGORY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};