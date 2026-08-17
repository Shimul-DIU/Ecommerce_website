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
    const isProduction =process.env.NODE_ENV === "production";
    const { email, password, rememberMe, agreedToTerms } = req.body;

    /* if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password required',
      });
    } */
    const fields = { email, password };

    for (let [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).json({
          error: { [key]: `${key} is required` },
        });
      }
    }

    const user = await Users.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        message: 'user not exists',
      });
    }
    if (!agreedToTerms) {
      return res.status(400).json({
        message: "Please agree to Terms & Conditions",
      });
    }
    if (!user.password) {
      return res.status(400).json({
        message: "Password not match",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: rememberMe ? '30d' : '15d' })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: isProduction ? "none" : "lax",
      maxAge: rememberMe ?
        30 * 24 * 60 * 60 * 1000 :
        15 * 24 * 60 * 60 * 1000,
      path: "/",
    })
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar || null,
      },

    });

  } catch (error) {
    console.error('loginUser error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
// ================= CREATE ACCESS TOKEN =================

const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};


// ================= REFRESH TOKEN =================

const refreshAccessToken = async (req, res) => {
  try {

    // Get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user
    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Create new access token
    const newAccessToken = createAccessToken(user);

    return res.status(200).json({
      accessToken: newAccessToken,

      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("Refresh Error:", error);

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};// =====================================================
// LOGOUT
// =====================================================

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      message: "Internal server error",
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
      { expiresIn: '7d' }
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
  GoogleLogin,
  refreshAccessToken,
  logout
};