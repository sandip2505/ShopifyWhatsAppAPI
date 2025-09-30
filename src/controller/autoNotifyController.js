const nodemailer = require("nodemailer");
const autoNotifyController = {};

autoNotifyController.sendMail = (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: false,
      port: 587,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `AutoNotify - Restock Alert <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Failed to send mail" });
      }
      console.log("Email sent: " + info.response);
    });
    res.status(200).json({ message: "Mail sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send mail" });
  }
};

module.exports = autoNotifyController;
