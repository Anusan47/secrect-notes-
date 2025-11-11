import nodemailer from "nodemailer";

/**
 * Sends an email using SMTP credentials from environment variables.
 * @param {string} to - Recipient email
 * @param {string} subject - Subject of the email
 * @param {string} html - HTML content
 */
const sendMail = async (to, subject, html) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // use true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Secure Notes App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

export default sendMail;
