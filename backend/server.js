const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// ================= FOLDER SETUP =================
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ================= MIDDLEWARE =================

// ✅ CORS (safe + production ready)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
}));

// ✅ BODY PARSER
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILES
app.use("/uploads", express.static(uploadPath));

// ================= ROUTES =================
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/subcategory", require("./routes/subCategoryRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/stories", require("./routes/storyRoutes"));
app.use("/api/banners", require("./routes/bannerRoutes"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/orders", require("./routes/order"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ================= START SERVER (IMPORTANT FIX) =================
const startServer = async () => {
  try {
    await connectDB(); // ⛔ WAIT for MongoDB

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
  }
};

startServer();