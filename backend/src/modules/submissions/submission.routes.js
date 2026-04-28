import { Router } from "express";
import {
  submitTask,
  getMySubmissions,
  getSubmissionsByTask,
  gradeSubmission,
} from "./submission.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

// Student submits
router.post("/", authGuard, roleGuard("student"), submitTask);

// Student views own
router.get("/me", authGuard, roleGuard("student"), getMySubmissions);

// Instructor views submissions
router.get(
  "/task/:taskId",
  authGuard,
  roleGuard(["admin", "instructor"]),
  getSubmissionsByTask
);

// Instructor grades
router.put(
  "/:id/grade",
  authGuard,
  roleGuard(["admin", "instructor"]),
  gradeSubmission
);

export default router;