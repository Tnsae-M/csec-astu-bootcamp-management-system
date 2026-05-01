import { login, myUser, refresh, register,verifyEmailController,forgotPasswordController,
    resetPasswordController, changePasswordController, adminResetPasswordController
 } from "./auth.controller.js";
import { Router } from "express";
import { authRateLimiter } from "../../middleware/rateLimiter.middleware.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerValidation, loginValidation } from "./auth.validation.js";

const router = Router();
//, roleGuard("admin")
router.post("/register", registerValidation, validate, register);
router.get("/me", authGuard, myUser);
router.post("/login", loginValidation, validate, login);
router.post("/refresh", refresh);
router.get("/verify/:token", verifyEmailController);
// router.post("/forgot-password", forgotPasswordController);
// router.post("/reset-password/:token", resetPasswordController);
// router.get("/verify/:token", verifyEmailController);


router.get("/verify-email/:token", verifyEmailController);

router.post(
  "/forgot-password",
  authRateLimiter("forgotPassword"),
  forgotPasswordController
);

router.post("/reset-password/:token", resetPasswordController);

// Profile Password Management
router.put("/change-password", authGuard, changePasswordController);

// Admin-Mediated Reset
router.put("/admin/reset-password/:userId", authGuard, roleGuard(['ADMIN', 'SUPER ADMIN']), adminResetPasswordController);

export default router;
