import Admin from "../model/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/mail.js";
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        console.log(email, password);

        const existingAdmin = await Admin.findOne({ email }).select("+password");

        if (!existingAdmin) {
            return res.status(400).json({
                message: "Admin not found",
            });
        }

        const isMatch = await bcrypt.compare(password, existingAdmin.password);

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
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: "1000d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: "Bearer " + token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Step 1", email);

    const admin = await Admin.findOne({ email });
    console.log("Step 2");

    const token = jwt.sign(
      { id: admin._id },
      process.env.FORGOT_PASSWORD,
      { expiresIn: "15m" }
    );

    console.log("Step 3");

    console.log("Before sendMail");

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: "<h1>Hello</h1>",
    });

    console.log("After sendMail");

    return res.status(200).json({
      message: "Mail sent",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const ResetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.FORGOT_PASSWORD
        );

        const hashPassword = await bcrypt.hash(password, 10);

        await Admin.findByIdAndUpdate(
            decoded.id,
            {
                password: hashPassword,
            }
        );

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};