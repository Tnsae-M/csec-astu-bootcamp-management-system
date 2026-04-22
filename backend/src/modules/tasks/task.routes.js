import { Router } from "express";
import {
  createTask,
  getTasksByBootcamp,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

// Create task (admin/instructor)
router.post(
  "/",
  authGuard,
  roleGuard(["admin", "instructor"]),
  createTask
);

// Get tasks for a bootcamp (students must be enrolled)
router.get(
  "/bootcamp/:bootcampId",
  authGuard,
  getTasksByBootcamp
);

// Get single task
router.get("/:id", authGuard, getTaskById);

// Update task
router.put(
  "/:id",
  authGuard,
  roleGuard(["admin", "instructor"]),
  updateTask
);

// Delete task
router.delete(
  "/:id",
  authGuard,
  roleGuard("admin"),
  deleteTask
);

export default router;