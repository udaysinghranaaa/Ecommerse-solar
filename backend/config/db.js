const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔥 Connecting...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
  }
};

module.exports = connectDB;