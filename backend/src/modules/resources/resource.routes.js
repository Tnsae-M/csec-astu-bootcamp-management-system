import { Router } from "express";
import { uploadResource, getResources, deleteResource } from "./resource.controller.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/",
  authGuard,
  roleGuard(["admin", "instructor"]),
  upload.single("file"),
  uploadResource
);

router.get("/", authGuard, getResources);

router.delete(
  "/:id",
  authGuard,
  roleGuard(["admin", "instructor"]),
  deleteResource
);

export default router;
