import { Router } from "express";
import {
  createGroup,
  getGroupsByBootcamp,
  addMember,
  removeMember,
  deleteGroup,
} from "./group.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

// Create group
router.post(
  "/",
  authGuard,
  roleGuard(["admin", "instructor"]),
  createGroup
);

// Get groups
router.get(
  "/bootcamp/:bootcampId",
  authGuard,
  getGroupsByBootcamp
);

// Add member
router.put(
  "/:id/add",
  authGuard,
  roleGuard(["admin", "instructor"]),
  addMember
);

// Remove member
router.put(
  "/:id/remove/:userId",
  authGuard,
  roleGuard(["admin", "instructor"]),
  removeMember
);

// Delete group
router.delete(
  "/:id",
  authGuard,
  roleGuard("admin"),
  deleteGroup
);

export default router;