import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  submitTask,
  getMySubmissions,
  getSubmissionsByTask,
  gradeSubmission,
} from "./submission.controller.js";

import { authGuard, roleGuard } from "../../middleware/role.guard.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF files and common document types
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.zip', '.rar'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, ZIP, RAR files are allowed.'));
    }
  }
});

const router = Router();

// Student submits
router.post("/", authGuard, roleGuard("student"), upload.single('file'), submitTask);

// Student views own
router.get("/me", authGuard, roleGuard("student"), getMySubmissions);

// Instructor views submissions
router.get(
  "/task/:taskId",
  authGuard,
  roleGuard(["admin", "instructor", "super admin"]),
  getSubmissionsByTask
);

// Instructor grades
router.put(
  "/:id/grade",
  authGuard,
  roleGuard(["admin", "instructor"]),
  gradeSubmission
);

export default router;