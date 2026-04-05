const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    description: String,
    location: String,

    image: String,   // photo
    video: String,   // video URL (YouTube or file path)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);