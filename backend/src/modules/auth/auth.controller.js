import {
  loginUser,
  refreshAuthToken,
  registerUser,
  currentUser,
} from "./auth.service.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    return res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshAuthToken(refreshToken);
    return res.status(200).json({
      message: "Token refreshed",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await registerUser(name, email, password, role);
    return res.status(201).json({
      message: "Registration successful",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
};

export const myUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await currentUser(userId);
    return res.status(200).json({
      message: "Current user retrieved",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
};
