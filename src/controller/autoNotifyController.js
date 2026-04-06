const nodemailer = require("nodemailer");
const autoNotifyController = {};
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

autoNotifyController.sendMail = async (req, res) => {
  console.log("calling");
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  try {
    const { to, subject, html } = req.body;

    // Basic validation
    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Optional: Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const mailOptions = {
      from: `AutoNotify - Restock Alert <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo: "noreply@codecrewinfotech.com" 
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);

    return res.status(200).json({
      message: "Mail sent successfully",
      response: info.response,
    });

  } catch (error) {
    console.error("Mail Error:", error); // Better debugging

    return res.status(500).json({
      error: "Failed to send mail",
      details: error.message,
    });
  }
};

module.exports = autoNotifyController;
