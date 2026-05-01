import nodemailer from "nodemailer";

let etherealTransporter = null;

const getEtherealTransporter = async () => {
  if (etherealTransporter) return etherealTransporter;

  // Auto-create a free Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  console.log("------------------------------------------");
  console.log("📧 ETHEREAL TEST EMAIL ACCOUNT CREATED");
  console.log(`   User: ${testAccount.user}`);
  console.log(`   Pass: ${testAccount.pass}`);
  console.log(`   View emails at: https://ethereal.email`);
  console.log("------------------------------------------");

  etherealTransporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return etherealTransporter;
};

const getRealTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const hasRealConfig =
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== "your-16-char-app-password-here";

  try {
    let transporter;

    if (hasRealConfig) {
      transporter = getRealTransporter();
    } else {
      // Use Ethereal for development
      transporter = await getEtherealTransporter();
    }

    const message = {
      from: `"CSEC-ASTU BMS" <${process.env.EMAIL_SENDER || process.env.EMAIL_USER || "noreply@bms.local"}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(message);

    if (!hasRealConfig) {
      // Ethereal: print the preview URL
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("------------------------------------------");
      console.log(`📧 Email sent! View it here:`);
      console.log(`   ${previewUrl}`);
      console.log("------------------------------------------");
    } else {
      console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    }

    return info;
  } catch (error) {
    console.error(`❌ Email send failed: ${error.message}`);
    throw error;
  }
};
