import nodemailer from 'nodemailer';

const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: `"Secure Notes" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent to', to);
  } catch (err) {
    console.error('Failed to send email', err);
  }
};

export default sendMail;
