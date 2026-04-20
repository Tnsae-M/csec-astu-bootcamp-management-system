import express from "express";
import * as sessionController from "./session.controller.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";
import * as TasksController from "../tasks/tasks.controller.js";
const router = express.Router();

// create session (admin/instructor)
router.post(
  "/",
  authGuard,
  roleGuard(["admin", "instructor"]),
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
//from tasks
router.post(
  "/:sessionId/tasks",
  authGuard,
  roleGuard(["admin", "instructor"]),
  TasksController.createTask,
);
router.get(
  "/:sessionId/tasks",
  authGuard,
  roleGuard(["admin", "instructor"]),
  TasksController.getTasksBySession,
);
export default router;
