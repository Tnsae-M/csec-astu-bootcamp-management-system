import { Router } from "express";
import {
  createFeedback,
  getBootcampFeedback,
  getInstructorFeedback,
} from "./feedback.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

// Student submits feedback
router.post(
  "/",
  authGuard,
  roleGuard("student"),
  createFeedback
);

// View bootcamp feedback (admin/instructor)
router.get(
  "/bootcamp/:id",
  authGuard,
  roleGuard(["admin", "instructor"]),
  getBootcampFeedback
);

// View instructor feedback
router.get(
  "/instructor/:id",
  authGuard,
  roleGuard(["admin", "instructor"]),
  getInstructorFeedback
);

export default router;