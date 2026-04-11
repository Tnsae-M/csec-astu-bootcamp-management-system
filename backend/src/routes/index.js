import { Router } from "express";

// Import all module routers
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import divisionRoutes from "../modules/divisions/division.routes.js";
import bootcampRoutes from "../modules/bootcamps/bootcamp.routes.js";
import sessionRoutes from "../modules/sessions/session.routes.js";
import attendanceRoutes from "../modules/attendance/attendance.routes.js";
import taskRoutes from "../modules/tasks/task.routes.js";
import submissionRoutes from "../modules/submissions/submission.routes.js";
import feedbackRoutes from "../modules/feedback/feedback.routes.js";
import groupRoutes from "../modules/groups/group.routes.js";
import progressRoutes from "../modules/progress/progress.routes.js";
import resourceRoutes from "../modules/resources/resource.routes.js";
import enrollmentRoutes from "../modules/enrollments/enrollment.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

// Mount all module routers
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/divisions", divisionRoutes);
router.use("/bootcamps", bootcampRoutes);
router.use("/sessions", sessionRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/tasks", taskRoutes);
router.use("/submissions", submissionRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/groups", groupRoutes);
router.use("/progress", progressRoutes);
router.use("/resources", resourceRoutes);
router.use("/enrollments", enrollmentRoutes);

export default router;