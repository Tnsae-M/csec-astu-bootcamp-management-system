import { Router } from "express";
import { getMyProgress } from "./progress.controller.js";
import { authGuard } from "../../middleware/role.guard.js";

const router = Router();

// Student progress
router.get(
  "/:bootcampId/me",
  authGuard,
  getMyProgress
);

router.get(
  "/bootcamp/:bootcampId",
  authGuard,
  (req, res) => res.json({ success: true, data: [] })
);

export default router;