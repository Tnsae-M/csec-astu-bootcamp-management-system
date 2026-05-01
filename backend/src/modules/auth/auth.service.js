import User from "../users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../../utils/email.js";

const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

const sanitizeUser = (user) => {
  // Ensure roles array is populated from legacy role field if necessary
  let roles = Array.isArray(user.roles) ? user.roles : [];
  
  if (user.role && roles.length === 0) {
    const legacyRoles = Array.isArray(user.role) ? user.role : [user.role];
    roles = legacyRoles.map(r => String(r).toLowerCase());
  }
  
  // Convert roles to uppercase for frontend consistency
  roles = roles.map(r => String(r).toUpperCase());
  
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    roles: roles,
    status: user.status,
  };
};

// const generateToken = () => {
//   return crypto.randomBytes(32).toString("hex");
// };

const createToken = (payload, secret, expiresIn) => {
  if (!secret) {
    throw Object.assign(new Error("Missing JWT secret"), { statusCode: 500 });
  }
  return jwt.sign(payload, secret, { expiresIn });
};

const generateTokens = (user) => {
  const accessToken = createToken(
    { userId: user._id.toString(), roles: user.roles },
    process.env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRES,
  );

  const refreshToken = createToken(
    { userId: user._id.toString(), roles: user.roles },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    REFRESH_TOKEN_EXPIRES,
  );

  return { accessToken, refreshToken };
};

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein', 'welcome'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push("Password cannot contain common words");
  }
  
  return errors;
};

const validateName = (name) => {
  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }
  
  if (name.length > 50) {
    return "Name must not exceed 50 characters";
  }
  
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  
  return null;
};

export const registerUser = async (name, email, password, role) => {
  if (!name || !email || !password) {
    throw Object.assign(new Error("Name, email, and password are required."), {
      statusCode: 400,
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    throw Object.assign(new Error("Please provide a valid email address."), {
      statusCode: 400,
    });
  }

  // Validate name
  const nameError = validateName(name);
  if (nameError) {
    throw Object.assign(new Error(nameError), { statusCode: 400 });
  }

  // Validate password strength
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    throw Object.assign(new Error(`Password requirements not met:\n${passwordErrors.join('\n')}`), {
      statusCode: 400,
    });
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw Object.assign(new Error("Email is already registered."), {
      statusCode: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  //  1. CREATE OTP (6 digits)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  //  2. HASH OTP (store this)
  const hashedToken = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // 3. CREATE USER
  const user = new User({
    name,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    roles: Array.isArray(role) ? role.map(r => r.toUpperCase()) : [role ? role.toUpperCase() : "STUDENT"],
    isEmailVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  await user.save();

  //  4. SEND EMAIL (REAL or Simulation)
  const verifyURL = `http://localhost:3000/verify-email?email=${encodeURIComponent(user.email)}&token=${otp}`;

  // Always print OTP to console as a fallback
  console.log("------------------------------------------");
  console.log(`📧 OTP for ${user.email}: ${otp}`);
  console.log(`🔗 Verify link: ${verifyURL}`);
  console.log("------------------------------------------");

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your email - OTP",
      text: `Your verification code is: ${otp}. You can also verify by clicking: ${verifyURL}`,
      html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Verify Your Email</h2>
        <p>Your 6-digit verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; padding: 10px; background: #f1f5f9; display: inline-block; border-radius: 5px;">
          ${otp}
        </div>
        <p style="margin-top: 20px;">Or click the button below:</p>
        <a href="${verifyURL}" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Account</a>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">This code will expire in 15 minutes.</p>
      </div>
      `,
    });
  } catch (emailErr) {
    console.error(`⚠️  Email delivery failed (SMTP error): ${emailErr.message}`);
    console.error("   Check your EMAIL_USER / EMAIL_PASS credentials in .env");
    // Do NOT re-throw — user was saved, OTP is in console
  }
  return sanitizeUser(user);
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw Object.assign(new Error("Email and password are required."), {
      statusCode: 400,
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    throw Object.assign(new Error("Please provide a valid email address."), {
      statusCode: 400,
    });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw Object.assign(new Error("Invalid credentials."), { statusCode: 401 });
  }

  if (!user.isEmailVerified) {
    throw Object.assign(new Error("Please verify your email first"), {
      statusCode: 403,
    });

    if (user.status !== "active") {
      throw Object.assign(new Error("Account is not active."), {
        statusCode: 403,
      });
    }
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw Object.assign(new Error("Invalid credentials."), { statusCode: 401 });
  }

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: sanitizeUser(user),
  };
};

export const refreshAuthToken = async (refreshToken) => {
  if (!refreshToken) {
    throw Object.assign(new Error("Refresh token is required."), {
      statusCode: 400,
    });
  }

  let payload;
  try {
    payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    );
  } catch (error) {
    throw Object.assign(new Error("Invalid or expired refresh token."), {
      statusCode: 401,
    });
  }

  const user = await User.findById(payload.userId);
  if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
    throw Object.assign(new Error("Refresh token is invalid."), {
      statusCode: 401,
    });
  }

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const currentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found."), { statusCode: 404 });
  }
  return sanitizeUser(user);
};

// Email verfication

export const verifyEmail = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw Object.assign(new Error("Invalid or expired token"), {
      statusCode: 400,
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return { message: "Email verified successfully" };
};

export const resendVerificationToken = async (email) => {
  if (!email) throw Object.assign(new Error("Email is required"), { statusCode: 400 });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  if (user.isEmailVerified) throw Object.assign(new Error("Email already verified"), { statusCode: 400 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedToken = crypto.createHash("sha256").update(otp).digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  const verifyURL = `http://localhost:3000/verify-email?email=${encodeURIComponent(user.email)}&token=${otp}`;

  console.log("------------------------------------------");
  console.log(`📧 OTP for ${user.email}: ${otp}`);
  console.log(`🔗 Verify link: ${verifyURL}`);
  console.log("------------------------------------------");

  try {
    await sendEmail({
      to: user.email,
      subject: "Your new verification code",
      text: `Your new verification code is: ${otp}. Link: ${verifyURL}`,
      html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Verify Your Email</h2>
        <p>Your new 6-digit verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; padding: 10px; background: #f1f5f9; display: inline-block; border-radius: 5px;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">This code will expire in 15 minutes.</p>
      </div>
      `,
    });
  } catch (emailErr) {
    console.error(`⚠️  Email delivery failed (SMTP error): ${emailErr.message}`);
    console.error("   Check your EMAIL_USER / EMAIL_PASS credentials in .env");
    // Do NOT re-throw — OTP is saved to DB and printed to console
  }

  return { message: "Verification code resent successfully" };
};

import { createNotification } from "../notification/notification.service.js";

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw Object.assign(new Error("User not found"), {
      statusCode: 404,
    });
  }

  // Create reset token for the user (admins will use this or just reset it)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Find all Admins and Super Admins
  const admins = await User.find({ roles: { $in: ['ADMIN', 'SUPER ADMIN'] } });

  // Notify each Admin
  for (const admin of admins) {
    await createNotification({
      recipient: admin._id,
      type: 'SECURITY',
      title: 'Password Reset Request',
      message: `User ${user.name} (${user.email}) has requested a password reset. Please review and reset their credentials in the User Management section.`,
      metadata: { userId: user._id, email: user.email }
    });
  }

  return { message: "Your request has been sent to the system administrators for verification." };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    throw Object.assign(new Error("Current password and new password are required"), { statusCode: 400 });
  }

  // Validate new password strength
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    throw Object.assign(new Error(`New password requirements not met:\n${passwordErrors.join('\n')}`), {
      statusCode: 400,
    });
  }

  // Check if new password is the same as current password
  if (currentPassword === newPassword) {
    throw Object.assign(new Error("New password must be different from current password"), { statusCode: 400 });
  }

  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw Object.assign(new Error("Current password is incorrect"), { statusCode: 401 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Password updated successfully" };
};

export const adminResetPassword = async (userId, newPassword) => {
  if (!newPassword) {
    throw Object.assign(new Error("New password is required"), { statusCode: 400 });
  }

  // Validate new password strength
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    throw Object.assign(new Error(`Password requirements not met:\n${passwordErrors.join('\n')}`), {
      statusCode: 400,
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Notify user that their password was reset
  await createNotification({
    recipient: user._id,
    type: 'SECURITY',
    title: 'Password Reset Successful',
    message: 'Your password has been reset by an administrator. Please log in with your new credentials.',
    channels: { inApp: true, email: true }
  });

  return { message: `Password for ${user.name} has been reset successfully` };
};

export const resetPassword = async (token, newPassword) => {
  if (!newPassword) {
    throw Object.assign(new Error("New password is required"), { statusCode: 400 });
  }

  // Validate new password strength
  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    throw Object.assign(new Error(`Password requirements not met:\n${passwordErrors.join('\n')}`), {
      statusCode: 400,
    });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw Object.assign(new Error("Invalid or expired token"), {
      statusCode: 400,
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return { message: "Password reset successful" };
};
