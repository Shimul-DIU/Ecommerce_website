import nodemailer from "nodemailer";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTP_PASS,
  },
});
transporter.verify()
  .then(() => console.log("SMTP Connected"))
  .catch((err) => console.error("SMTP Verify Error:", err));

export default transporter;