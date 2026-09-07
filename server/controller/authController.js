import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import resend from "../config/mail.js";
import Users from "../model/userModel.js";

dotenv.config();

const saltRounds = 10;

// =====================================================
// REFRESH COOKIE OPTIONS
// =====================================================

const getRefreshCookieOptions = (req) => {
  const isProduction =
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,

    // Production HTTPS
    secure: isProduction,

    // Different frontend/backend domains
    sameSite: isProduction ? "none" : "lax",

    path: "/",
  };
};

// =====================================================
// CREATE ACCESS TOKEN
// =====================================================

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

// =====================================================
// CREATE USER
// =====================================================

const createUser = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      confirmPassword,
    } = req.body;

    const fields = {
      fullname,
      email,
      password,
      confirmPassword,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).json({
          error: {
            [key]: `${key} is required`,
          },
        });
      }
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: {
          confirmPassword: "Password not matched",
        },
      });
    }

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: {
          email: "Email is already registered",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      saltRounds
    );

    const user = new Users({
      fullname,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(200).json({
      message: "User created successfully",
    });

  } catch (error) {
    console.error("createUser error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
      rememberMe,
      agreedToTerms,
    } = req.body;

    const fields = {
      email,
      password,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).json({
          error: {
            [key]: `${key} is required`,
          },
        });
      }
    }

    if (!agreedToTerms) {
      return res.status(400).json({
        message: "Please agree to Terms & Conditions",
      });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Password not match",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // -----------------------------------------------
    // TOKENS
    // -----------------------------------------------

    const accessToken = createAccessToken(user);

    const refreshToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: rememberMe ? "30d" : "15d",
      }
    );

    // -----------------------------------------------
    // COOKIE
    // -----------------------------------------------

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        ...getRefreshCookieOptions(req),

        maxAge: rememberMe
          ? 30 * 24 * 60 * 60 * 1000
          : 15 * 24 * 60 * 60 * 1000,
      }
    );

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      message: "Login successful",

      accessToken,

      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar || null,
      },
    });

  } catch (error) {
    console.error("loginUser error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

const refreshAccessToken = async (req, res) => {
  try {

    // -----------------------------------------------
    // GET COOKIE
    // -----------------------------------------------

    const refreshToken =
      req.cookies?.refreshToken;

    console.log(
      "Refresh cookie exists:",
      Boolean(refreshToken)
    );

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    // -----------------------------------------------
    // VERIFY TOKEN
    // -----------------------------------------------

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // CREATE NEW ACCESS TOKEN
    // -----------------------------------------------

    const newAccessToken =
      createAccessToken(user);

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      accessToken: newAccessToken,

      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar || null,
      },
    });

  } catch (error) {

    console.error(
      "Refresh Error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

// =====================================================
// LOGOUT
// =====================================================

const logout = async (req, res) => {
  try {

    res.clearCookie(
      "refreshToken",
      getRefreshCookieOptions(req)
    );

    return res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {

    console.error(
      "Logout Error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset Request",

      html: `
        <h2>Password Reset Request</h2>

        <p>
          Click the link below to reset your password:
        </p>

        <a href="${resetUrl}">
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>
      `,
    });

    return res.json({
      success: true,
      message: "Reset email sent",
    });

  } catch (error) {

    console.error(
      "forgotPassword error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong. Please try again later.",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await Users.findOne({
      resetPasswordToken: token,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token expired or invalid",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        saltRounds
      );

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {

    console.error(
      "resetPassword error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong. Please try again later.",
    });
  }
};

// =====================================================
// GOOGLE LOGIN
// =====================================================

const GoogleLogin = async (req, res) => {
  try {

    const {
      fullname,
      email,
      photoURL,
      firebaseId,
    } = req.body;

    if (!email || !firebaseId) {
      return res.status(400).json({
        message:
          "Email and firebaseId are required",
      });
    }

    let user = await Users.findOne({ email });

    if (!user) {

      user = new Users({
        email,
        fullname,
        avatar: photoURL,
        firebaseId,
        provider: "google",
      });

      await user.save();
    }

    // -----------------------------------------------
    // TOKENS
    // -----------------------------------------------

    const accessToken =
      createAccessToken(user);

    const refreshToken =
      jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "15d",
        }
      );

    // -----------------------------------------------
    // COOKIE
    // -----------------------------------------------

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        ...getRefreshCookieOptions(req),

        maxAge:
          15 * 24 * 60 * 60 * 1000,
      }
    );

    return res.status(200).json({
      message: "Login successful",

      accessToken,

      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar || null,
      },
    });

  } catch (error) {

    console.error(
      "GoogleLogin error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

export {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  GoogleLogin,
  refreshAccessToken,
  logout,
};