import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Force IPv4 to avoid Render's IPv6 ENETUNREACH issue with Gmail SMTP
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    });

  } catch (error) {
    console.log("Email Error:", error.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;