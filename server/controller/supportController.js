import resend from "../config/mail.js";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendSupportMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      orderId = "",
      category = "other",
      source = "website",
      lang = "",
    } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      message.trim().length < 10
    ) {
      return res.status(400).json({
        message: "Name, a valid email, and a message of at least 10 characters are required.",
      });
    }

    const recipient = process.env.EMAIL;
    if (!recipient) {
      console.error("sendSupportMessage error: EMAIL is not configured");
      return res.status(500).json({
        message: "Mail service is not configured.",
      });
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim()).replaceAll("\n", "<br>");
    const safeOrderId = escapeHtml(orderId || "Not provided");
    const safeCategory = escapeHtml(category);
    const safeSource = escapeHtml(source);
    const safeLang = escapeHtml(lang);

    await resend.emails.send({
      from: "Ecommerce Support <onboarding@resend.dev>",
      to: recipient,
      replyTo: email.trim(),
      subject: `Support message from ${name.trim()} - ${category}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#1f2937">
          <h2 style="color:#4f46e5">New support message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Order ID:</strong> ${safeOrderId}</p>
          <p><strong>Category:</strong> ${safeCategory}</p>
          <p><strong>Source:</strong> ${safeSource}</p>
          ${safeLang ? `<p><strong>Language:</strong> ${safeLang}</p>` : ""}
          <hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0">
          <p style="white-space:normal"><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Your message was sent successfully.",
    });
  } catch (error) {
    console.error("sendSupportMessage error:", error);
    return res.status(500).json({
      message: "Failed to send the message. Please try again.",
    });
  }
};
