const express = require("express");
const router = express.Router();

const { createAdmin, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
router.post("/create-admin", createAdmin);
router.post("/login", login);

// 🔐 protected route
router.get("/admin-check", auth, (req, res) => {
  res.json({ success: true });
});

module.exports = router;