import { loginUser, refreshAuthToken } from "./auth.service.js";

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
