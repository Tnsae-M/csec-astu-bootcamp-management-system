import jwt from "jsonwebtoken";

export const roleGuard = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      let userRole;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        if (!process.env.JWT_SECRET) {
          const error = new Error(
            "Server configuration error: JWT secret missing",
          );
          error.status = 500;
          return next(error);
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, role: payload.role };
      }

      if (!req.user || !req.user.role) {
        const error = new Error("Access denied: Authentication required");
        error.status = 401;
        return next(error);
      }

      const rolesArray = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
      const hasPermission = userRoles.some(r => rolesArray.includes(r));

      if (!hasPermission) {
        const error = new Error(
          `Access denied: Insufficient role permissions. Required one of: ${rolesArray.join(", ")}`,
        );
        error.status = 403;
        return next(error);
      }

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const error = new Error("Token expired");
        error.status = 401;
        return next(error);
      } else if (err.name === "JsonWebTokenError") {
        const error = new Error("Invalid token");
        error.status = 401;
        return next(error);
      }
      next(err);
    }
  };
};

export const authGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      if (!process.env.JWT_SECRET) {
        const error = new Error(
          "Server configuration error: JWT secret missing",
        );
        error.status = 500;
        return next(error);
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: payload.userId, role: payload.role };
    }

    if (!req.user) {
      const error = new Error("Authentication required");
      error.status = 401;
      return next(error);
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const error = new Error("Token expired");
      error.status = 401;
      return next(error);
    } else if (err.name === "JsonWebTokenError") {
      const error = new Error("Invalid token");
      error.status = 401;
      return next(error);
    }
    next(err);
  }
};
