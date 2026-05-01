import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  getResourcesBySession,
  uploadResource,
  downloadResource,
} from "./resource.controller.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = Router();

router.get("/session/:sessionId", authGuard, getResourcesBySession);
router.post(
  "/session/:sessionId",
  authGuard,
  roleGuard(["admin", "instructor"]),
  upload.single("file"),
  uploadResource
);
router.get("/:id/download", authGuard, downloadResource);

export default router;
