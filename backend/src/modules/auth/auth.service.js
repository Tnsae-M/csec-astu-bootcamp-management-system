import User from "../users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

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
  const user = new User({
    name,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: role || "user",
    status: "active",
  });
  await user.save();
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

  if (user.status !== "active") {
    throw Object.assign(new Error("Account is not active."), {
      statusCode: 403,
    });
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
