const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// CREATE ADMIN
exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check existing admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        msg: "Admin already exists",
      });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create admin
    const admin = await Admin.create({
      email,
      password: hashed,
    });

    res.status(201).json({
      msg: "Admin created successfully",
      admin,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN EMAIL:", email);

    // find admin
    const admin = await Admin.findOne({
      email: email.trim(),
    });

    console.log("ADMIN FOUND:", admin);

    // check admin
    if (!admin) {
      return res.status(400).json({
        msg: "Admin not found",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    // wrong password
    if (!isMatch) {
      return res.status(400).json({
        msg: "Wrong password",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      msg: "Login Successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server Error",
    });
  }
};