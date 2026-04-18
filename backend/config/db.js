const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      console.log("⚡ MongoDB already connected");
      return;
    }

    console.log("🔥 Connecting to MongoDB...");
    console.log("🔥 MONGO_URI =", process.env.MONGO_URI);

    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,

      // 🔥 MOST IMPORTANT FIX
      family: 4, // force IPv4 (Render DNS fix)
    });

    isConnected = true;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);

    console.log("🔁 Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;