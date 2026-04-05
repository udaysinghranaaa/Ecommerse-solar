const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;

    console.log("🔹 RAW HEADER:", authHeader);

    // ❌ No token
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Extract token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    console.log("🔹 TOKEN:", token);

    // ❌ Invalid token
    if (!token || token === "undefined") {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ❌ Secret missing
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    // ✅ Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ DECODED:", decoded);

    req.user = decoded;

    next(); // ✅ MUST BE FUNCTION

  } catch (err) {
    console.error("❌ JWT ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid token",
      error: err.message,
    });
  }
};

module.exports = auth; // ✅ IMPORTANT