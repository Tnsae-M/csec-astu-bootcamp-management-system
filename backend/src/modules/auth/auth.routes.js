import { login, myUser, refresh, register,verifyEmailController,forgotPasswordController,
    resetPasswordController
 } from "./auth.controller.js";
import { Router } from "express";
import { authRateLimiter } from "../../middleware/rateLimiter.middleware.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();
//, roleGuard("admin")
router.post("/register", register);
router.get("/me", authGuard, myUser);
router.post("/login", authRateLimiter("login"), login);
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
export default router;
