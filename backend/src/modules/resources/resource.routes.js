import express from "express";
import {
  createResource,
  getResources,
  getResourcesBySession,
  deleteResource,
  downloadResource,
} from "./resource.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = express.Router();

router.post("/", authGuard, roleGuard(["admin", "instructor"]), createResource);
router.get("/", authGuard, getResources);
router.get("/session/:sessionId", authGuard, getResourcesBySession);
router.delete("/:id", authGuard, deleteResource);
router.patch("/download/:id", authGuard, downloadResource);

export default router;