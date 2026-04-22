import { Router } from "express";
import {
  getBootcampById,
  updateBootcamp,
  deleteBootcamp,
} from "./bootcamp.controller.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = Router();

router.get("/:id", authGuard, getBootcampById);
router.put("/:id", authGuard, roleGuard("admin"), updateBootcamp);
router.delete("/:id", authGuard, roleGuard("admin"), deleteBootcamp);

export default router;
