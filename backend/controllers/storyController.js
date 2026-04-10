const Story = require("../models/story");

// ================= CREATE =================
exports.createStory = async (req, res) => {
  try {
    const { name, title, description, location, video } = req.body;

    const story = await Story.create({
      name,
      title,
      description,
      location,
      video,
      image: req.file ? req.file.path : "",
    });

    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET =================
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 ================= DELETE =================
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    await Story.findByIdAndDelete(id);

    res.json({ message: "✅ Story deleted successfully" });
  } catch (err) {
    console.error("DELETE STORY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};