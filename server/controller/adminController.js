const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email }).select("+password");

    if (!existingAdmin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: existingAdmin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1000d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: "Bearer " + token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = loginAdmin;