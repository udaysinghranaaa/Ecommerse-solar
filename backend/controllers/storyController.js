const Story = require("../models/Story");

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

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};