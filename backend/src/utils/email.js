import nodemailer from "nodemailer";

const smtpConfig = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

export const sendEmail = async ({ to, subject, text, html }) => {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    console.log("------------------------------------------");
    console.log("📧 EMAIL SERVICE SIMULATION (SMTP not configured)");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log("------------------------------------------");
    return { message: "Email logged to console (dev mode)" };
  }

  const message = {
    from: process.env.EMAIL_SENDER || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(message);
};
