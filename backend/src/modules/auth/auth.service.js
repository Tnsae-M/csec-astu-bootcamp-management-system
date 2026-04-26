import User from "../users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../../utils/email.js";



const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});


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
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRES,
  );

  const refreshToken = createToken(
    { userId: user._id.toString(), role: user.role },
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
    role: role || "student",
    isEmailVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  await user.save();

  //  4. SEND EMAIL (REAL)
  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

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

// BACKEND: auth.service.js
export const verifyEmail = async (token) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  let user = await User.findOne({ emailVerificationToken: hashedToken });

  //  NEW: If no user, check if already verified
  if (!user) {
    const alreadyVerifiedUser = await User.findOne({
      isEmailVerified: true
    });

    if (alreadyVerifiedUser) {
      return { message: "Email already verified" };
    }

    throw Object.assign(new Error("Token is invalid"), { statusCode: 400 });
  }

  if (user.emailVerificationExpires < Date.now()) {
    throw Object.assign(new Error("Token expired"), { statusCode: 400 });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return { message: "Email verified successfully" };
};
// export const verifyEmail = async (token) => {
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");

//   const user = await User.findOne({
//     emailVerificationToken: hashedToken,
//     emailVerificationExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     throw Object.assign(new Error("Invalid or expired token"), {
//       statusCode: 400,
//     });
//   }

//   user.isEmailVerified = true;
//   user.emailVerificationToken = undefined;
//   user.emailVerificationExpires = undefined;

//   await user.save();

//   return { message: "Email verified successfully" };
// };

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw Object.assign(new Error("User not found"), {
      statusCode: 404,
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // await sendEmail(user.email, "Reset Password", resetURL);

  await sendEmail({
  to: user.email,
  subject: "Reset Password",
  text: `Click this link: ${resetURL}`,
  html: `
    <h2>Reset Your Password</h2>
    <p>Click below to Reset your password:</p>
    <a href="${resetURL}">Reset_Password</a>
  `,
});

  return { message: "Reset link sent to email" };
};


export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

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