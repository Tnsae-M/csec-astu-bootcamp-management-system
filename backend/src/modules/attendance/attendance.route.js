import { Router } from "express";
import {
  markAttendance,
  getSessionAttendance,
  getMyAttendance,
} from "./attendance.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

// instructor/admin marks attendance
router.post("/", authGuard, roleGuard(["admin", "instructor"]), markAttendance);

// get attendance for a session
router.get(
  "/session/:sessionId",
  authGuard,
  getSessionAttendance
);

// student sees their own attendance
router.get("/me", authGuard, getMyAttendance);

export default router;