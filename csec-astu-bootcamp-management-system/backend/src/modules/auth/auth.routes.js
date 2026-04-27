import { login, refresh } from "./auth.controller.js";
import { Router } from "express";
import { authRateLimiter } from "../../middleware/rateLimiter.middleware.js";

const router = Router();

router.post("/login", authRateLimiter("login"), login);
router.post("/refresh", refresh);

export default router;
