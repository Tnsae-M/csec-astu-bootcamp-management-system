import { Router } from "express";
import { submitFeedback, getFeedbackBySession } from "./feedback.controller.js";
import { roleGuard } from "../../middleware/role.guard.js";

const router = Router();

// Student route
router.post("/", roleGuard(["student"]), submitFeedback);

// Instructor/Admin route
router.get(
  "/session/:sessionId",
  roleGuard(["instructor", "admin"]),
  getFeedbackBySession
);

export default router;