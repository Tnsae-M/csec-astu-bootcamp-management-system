import express from "express";
import { 
  createGroupController, 
  getGroupsByBootcampController, 
  addMemberController, 
  removeMemberController, 
  deleteGroupController,
  submitProgress,
  getGroupProgressLogs
} from "./group.controller.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = express.Router();

router.post("/", authGuard, roleGuard(['ADMIN', 'SUPER ADMIN']), createGroupController);
router.get("/bootcamp/:bootcampId", authGuard, getGroupsByBootcampController);
router.put("/:groupId/members", authGuard, roleGuard(['ADMIN', 'SUPER ADMIN']), addMemberController);
router.delete("/:groupId/members/:userId", authGuard, roleGuard(['ADMIN', 'SUPER ADMIN']), removeMemberController);
router.delete("/:groupId", authGuard, roleGuard(['ADMIN', 'SUPER ADMIN']), deleteGroupController);

// Weekly Progress
router.post("/progress", authGuard, submitProgress);
router.get("/progress/:groupId", authGuard, getGroupProgressLogs);

export default router;