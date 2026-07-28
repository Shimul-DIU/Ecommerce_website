import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import resend from '../config/mail.js';
import Users from '../model/userModel.js';

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

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: { email: 'Email is already registered' },
      });
    }

    const hashpassword = await bcrypt.hash(password, saltRounds);

    const user = new Users({
      fullname,
      email,
      password: hashpassword,
    });

    await user.save();

    return res.status(200).json({
      message: 'User created successfully',
    });

  } catch (error) {
    console.error('createUser error:', error);
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

    const user = await Users.findOne({ email }).select('+password');

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
    console.error('loginUser error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });

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

    await resend.emails.send(
      {
        from: "onboarding@resend.dev",
        to: email,
        subject: "Password Reset Request",
        html: `
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
    console.error('forgotPassword error:', error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await Users.findOne({
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
    console.error('resetPassword error:', error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

/* ================= GOOGLE LOGIN ================= */
const GoogleLogin = async (req, res) => {
  try {
    const { fullname, email, photoURL, firebaseId } = req.body;

    if (!email || !firebaseId) {
      return res.status(400).json({
        message: 'Email and firebaseId are required',
      });
    }

    let user = await Users.findOne({ email });

    if (!user) {
      user = new Users({
        email,
        fullname,
        avatar: photoURL,
        firebaseId,
        provider: 'google',
      });
      await user.save();
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '40d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token: 'Bearer ' + token,
    });
  } catch (error) {
    console.error('GoogleLogin error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/* ================= EXPORT ================= */
export {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  GoogleLogin
};