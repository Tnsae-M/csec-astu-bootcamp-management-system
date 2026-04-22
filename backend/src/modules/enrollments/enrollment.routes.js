import { Router } from "express";
import {
  enroll,
  getBootcampEnrollments,
  getMyEnrollments,
  updateStatus,
} from "./enrollment.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

// Admin/instructor enrolls a user
router.post("/", authGuard, roleGuard(["admin", "instructor"]), enroll);

// Get students in bootcamp
router.get(
  "/bootcamp/:id",
  authGuard,
  roleGuard(["admin", "instructor"]),
  getBootcampEnrollments
);

// Student sees their enrollments
router.get("/me", authGuard, getMyEnrollments);

// Update status (admin)
router.put(
  "/:id",
  authGuard,
  roleGuard("admin"),
  updateStatus
);

export default router;