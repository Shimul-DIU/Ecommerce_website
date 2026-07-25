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

        if (!email) {
            return res.status(400).json({message:"Email is required"});
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({message:"Email not found"});
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.FORGOT_PASSWORD,
            { expiresIn: "15m" }
        );

        const resetLink = `${process.env.CLIENT_URL}/admin/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password",
            html: `<h2>Reset password</h2>
            <p>click here</p>
             <a href="${resetLink}">
                    Reset Password
                </a>`
        });

        res.status(200).json({
            message:"Reset link sent successfully"
        });

    } catch (error) {
    return res.status(500).json({
        message: error.message
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