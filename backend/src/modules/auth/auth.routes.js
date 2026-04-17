import { login, myUser, refresh, register } from "./auth.controller.js";
import { Router } from "express";
import { authRateLimiter } from "../../middleware/rateLimiter.middleware.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

router.post("/register", roleGuard("admin"), register);
router.get("/me", authGuard, myUser);
router.post("/login", authRateLimiter("login"), login);
router.post("/refresh", refresh);

export default router;
