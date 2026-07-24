import users from '../model/userModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import transporter from '../config/mail.js';

dotenv.config();

const saltRounds = 10;

/* ================= CREATE USER ================= */
const createUser = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;

    const fields = { fullname, email, password, confirmPassword };

    for (let [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).json({
          error: { [key]: `${key} is required` },
        });
      }
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: { confirmPassword: 'Password not matched' },
      });
    }

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: { email: 'Email is already registered' },
      });
    }

    const hashpassword = await bcrypt.hash(password, saltRounds);

    const user = new users({
      fullname,
      email,
      password: hashpassword,
    });

    await user.save();

    return res.status(200).json({
      message: 'User created successfully',
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/* ================= LOGIN USER ================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password required',
      });
    }

    const user = await users.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '200d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token: 'Bearer ' + token,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail(
     {
      from:process.env.EMAIL,
      to:email,
      subject:"Password Reset Request",
      html:`
         <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `
     }


      
    );

    return res.json({
      success: true,
      message: "Reset email sent",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await users.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token expired or invalid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= EXPORT ================= */
export {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword
};