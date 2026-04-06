const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// ================= DB =================
connectDB();

// ================= FOLDER SETUP =================
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ================= MIDDLEWARE =================

// ✅ CORS (production ready)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

// ✅ BODY PARSERS
app.use(express.json());
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

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: err.message });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});