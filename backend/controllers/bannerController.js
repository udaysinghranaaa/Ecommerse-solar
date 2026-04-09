const Banner = require("../models/Banner");
const fs = require("fs");
const path = require("path");

// ================= CREATE =================
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, link } = req.body;

    const banner = await Banner.create({
      title,
      subtitle,
      link,
      image: req.file ? req.file.path : "",
    });

    res.json(banner);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET =================
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting Banner ID:", id);

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // 🔥 DELETE IMAGE FROM UPLOADS (FIXED)
    if (banner.image) {
      const filePath = path.join(__dirname, "..", banner.image);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("🧹 Image deleted:", filePath);
      } else {
        console.log("⚠️ Image not found:", filePath);
      }
    }

    // 🔥 DELETE FROM DB
    await Banner.findByIdAndDelete(id);

    res.json({ message: "✅ Banner deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};