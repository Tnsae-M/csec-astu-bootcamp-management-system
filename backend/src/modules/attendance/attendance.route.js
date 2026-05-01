import { Router } from "express";
import {
  markAttendance,
  getSessionAttendance,
  getMyAttendance,
} from "./attendance.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

// only instructor marks attendance
router.post("/", authGuard, roleGuard("INSTRUCTOR"), markAttendance);

// get attendance for a session
router.get(
  "/session/:sessionId",
  authGuard,
  getSessionAttendance
);

// student sees their own attendance
router.get("/me", authGuard, getMyAttendance);

export default router;