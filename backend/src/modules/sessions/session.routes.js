import express from "express";
import * as sessionController from "./session.controller.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = express.Router();

// create session (only instructor)
router.post(
  "/",
  authGuard,
  roleGuard(["instructor", "admin"]),
  sessionController.createSession,
);

// all sessions
router.get("/", authGuard, sessionController.getSessions);

// sessions by bootcamp
router.get(
  "/bootcamp/:bootcampId",
  authGuard,
  sessionController.getSessionsByBootcamp,
);

router.put(
  "/:id",
  authGuard,
  roleGuard(["admin", "instructor"]),
  sessionController.updateSession,
);

router.delete(
  "/:id",
  authGuard,
  roleGuard("admin"),
  sessionController.deleteSession,
);

export default router;
