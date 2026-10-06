import Admin from "../model/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import resend from "../config/mail.js";

const getAdminRefreshCookieOptions = (req) => {
    const isSecure = req.secure;

    return {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        path: "/",
    };
};

const createAdminAccessToken = (admin) => jwt.sign(
    {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        tokenType: "access",
    },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "15m" }
);

export const loginAdmin = async (req, res) => {
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

        const isMatch = await bcrypt.compare(password, existingAdmin.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password",
            });
        }

        const accessToken = createAdminAccessToken(existingAdmin);
        const refreshToken = jwt.sign(
            {
                id: existingAdmin._id,
                email: existingAdmin.email,
                role: existingAdmin.role,
                tokenType: "refresh",
            },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("adminRefreshToken", refreshToken, {
            ...getAdminRefreshCookieOptions(req),
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            admin: {
                id: existingAdmin._id,
                email: existingAdmin.email,
                role: existingAdmin.role,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const refreshAdminAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.adminRefreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Admin refresh token not found" });
        }

        const decoded = jwt.verify(refreshToken, process.env.ADMIN_JWT_SECRET);
        if (decoded.tokenType !== "refresh") {
            res.clearCookie("adminRefreshToken", getAdminRefreshCookieOptions(req));
            return res.status(401).json({ message: "Invalid admin refresh token" });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            res.clearCookie("adminRefreshToken", getAdminRefreshCookieOptions(req));
            return res.status(401).json({ message: "Admin not found" });
        }

        return res.status(200).json({
            accessToken: createAdminAccessToken(admin),
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("refreshAdminAccessToken error:", error.message);
        res.clearCookie("adminRefreshToken", getAdminRefreshCookieOptions(req));
        return res.status(401).json({ message: "Invalid or expired admin refresh token" });
    }
};

export const logoutAdmin = (req, res) => {
    res.clearCookie("adminRefreshToken", getAdminRefreshCookieOptions(req));
    return res.status(200).json({ message: "Logout successful" });
};

export const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "Email not found" });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.FORGOT_PASSWORD,
            { expiresIn: "15m" }
        );

        const resetLink = `${process.env.CLIENT_URL}/admin/reset-password/${token}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset Password",
            html: `<h2>Reset password</h2>
            <p>click here</p>
             <a href="${resetLink}">Reset Password</a>`,
        });

        res.status(200).json({
            message: "Reset link sent successfully",
        });

    } catch (error) {
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