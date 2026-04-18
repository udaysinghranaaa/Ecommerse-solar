require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");

const app = express();

// ================= FOLDER SETUP =================
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ================= MIDDLEWARE =================
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

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

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= ERROR =================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ================= START =================
const startServer = async () => {
  try {
    console.log("🌍 Starting server...");

    await connectDB(); // wait for DB

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();