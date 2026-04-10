const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// 🔥 COMMON FILTER
const activeFilter = {
  $or: [{ isActive: true }, { isActive: { $exists: false } }],
};

// ================= CREATE =================
exports.createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

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

    // ✅ SAFE FILE HANDLE
    const imageFiles = req.files?.images || [];
    const videoFiles = req.files?.videos || [];

    const imagePaths = imageFiles.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const videoPaths = videoFiles.map((file) => ({
      url: file.path,
    }));

    // ✅ FIXED SAFE PARSE (ONLY CHANGE HERE)
    const safeParse = (data) => {
      try {
        if (!data) return [];
        if (typeof data === "object") return data; // 🔥 FIX
        return JSON.parse(data);
      } catch {
        return [];
      }
    };

    const parsedSpecs = safeParse(req.body.technicalSpecs).filter(
      (s) => s?.key && s?.value // 🔥 FIX
    );

    const parsedFaqs = safeParse(req.body.faqs).filter(
      (f) => f?.question && f?.answer // 🔥 FIX
    );

    const parsedQa = safeParse(req.body.qa).filter(
      (q) => q?.question && q?.answer // 🔥 FIX
    );

    const parsedReviews = safeParse(req.body.customerReviews).map((r) => ({
      name: r?.name || "", // 🔥 FIX
      rating: Number(r?.rating) || 0,
      comment: r?.comment || "",
    }));

    // ✅ SAFE NUMBER HANDLING
    const mrpPrice = Number(req.body.mrpPrice);
    const discountPrice = Number(req.body.discountPrice);
    const stock = Number(req.body.stock);
    const gst = Number(req.body.gst) || 18;

    if (isNaN(mrpPrice) || isNaN(discountPrice)) {
      return res.status(400).json({
        message: "Invalid price values",
      });
    }

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      mrpPrice,
      discountPrice,
      gst,
      stock: isNaN(stock) ? 0 : stock,
      category: req.body.category,
      images: imagePaths,

      technicalSpecs: parsedSpecs,
      faqs: parsedFaqs,
      qa: parsedQa,

      customerReviews: parsedReviews,
      videos: videoPaths,

      isTrending:
        req.body.isTrending === "true" || req.body.isTrending === true,
      isFeatured:
        req.body.isFeatured === "true" || req.body.isFeatured === true,
      isSubsidy:
        req.body.isSubsidy === "true" || req.body.isSubsidy === true,

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

    res.json({
      ...product.toObject(),
      technicalSpecs: product.technicalSpecs || [],
      faqs: product.faqs || [],
      qa: product.qa || [],
      customerReviews: product.customerReviews || [],
      videos: product.videos || [],
    });
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

    const safeParse = (data) => {
      try {
        if (!data) return [];
        if (typeof data === "object") return data; // 🔥 FIX
        return JSON.parse(data);
      } catch {
        return [];
      }
    };

    if (req.body.technicalSpecs) {
      updateData.technicalSpecs = safeParse(req.body.technicalSpecs).filter(
        (s) => s?.key && s?.value
      );
    }

    if (req.body.faqs) {
      updateData.faqs = safeParse(req.body.faqs).filter(
        (f) => f?.question && f?.answer
      );
    }

    if (req.body.qa) {
      updateData.qa = safeParse(req.body.qa).filter(
        (q) => q?.question && q?.answer
      );
    }

    if (req.body.customerReviews) {
      updateData.customerReviews = safeParse(
        req.body.customerReviews
      ).map((r) => ({
        name: r?.name || "",
        rating: Number(r?.rating) || 0,
        comment: r?.comment || "",
      }));
    }

    const imageFiles = req.files?.images || [];
    const videoFiles = req.files?.videos || [];

    if (imageFiles.length > 0) {
      updateData.images = imageFiles.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    if (videoFiles.length > 0) {
      updateData.videos = videoFiles.map((file) => ({
        url: file.path,
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