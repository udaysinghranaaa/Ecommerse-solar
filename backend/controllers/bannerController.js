const Banner = require("../models/Banner");

// CREATE
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
    res.status(500).json({ error: err.message });
  }
};

// GET
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};