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
  if (user.role && (roles.length === 0 || (roles.length === 1 && roles[0].toLowerCase() === 'student' && user.role.toLowerCase() !== 'student'))) {
    roles = [user.role.toLowerCase()];
  }
  
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

export const registerUser = async (name, email, password, role) => {
  if (!name || !email || !password) {
    throw Object.assign(new Error("Name, email, and password are required."), {
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

  //  1. CREATE TOKEN (plain)
  const verificationToken = crypto.randomBytes(32).toString("hex");

  //  2. HASH TOKEN (store this)
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // 3. CREATE USER
  const user = new User({
    name,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    roles: Array.isArray(role) ? role : [role || "student"],
    isEmailVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  await user.save();

  //  4. SEND EMAIL (REAL)
  const verifyURL = `http://localhost:3000/verify-email/${verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    text: `Click this link: ${verifyURL}`,
    html: `
    <h2>Verify Your Email</h2>
    <p>Click below to verify your account:</p>
    <a href="${verifyURL}">Verify Email</a>
  `,
  });
  return sanitizeUser(user);
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw Object.assign(new Error("Email and password are required."), {
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
