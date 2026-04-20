import { Router } from "express";
import * as TasksController from "./tasks.controller.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";
const router = Router();

router.put(
  "/:id",
  authGuard,
  roleGuard(["admin", "instructor"]),
  TasksController.updateTask,
);
router.delete(
  "/:id",
  authGuard,
  roleGuard(["admin", "instructor"]),
  TasksController.deleteTask,
);
export default router;
