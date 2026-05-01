import {
  loginUser,
  refreshAuthToken,
  registerUser,
  currentUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  adminResetPassword
} from "./auth.service.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    return res.status(200).json({
      success:true,
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
      success:true,
      message: "Registration successfully.please verify your email",
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


export const verifyEmailController = async (req, res, next) => {
  try {
    const data = await verifyEmail(req.params.token);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const forgotPasswordController = async (req, res, next) => {
  try {
    const data = await forgotPassword(req.body.email);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const data = await resetPassword(
      req.params.token,
      req.body.password
    );
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    const data = await changePassword(userId, currentPassword, newPassword);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const adminResetPasswordController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    const data = await adminResetPassword(userId, newPassword);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};