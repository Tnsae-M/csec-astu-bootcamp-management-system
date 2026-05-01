
import { Router } from "express";
import userRoutes from "../modules/users/user.routes.js";
import sessionRoutes from "../modules/sessions/session.routes.js";
import divisionRoutes from "../modules/divisions/division.route.js";
import bootcampRoutes from "../modules/bootcamps/bootcamp.route.js";
import attendanceRoutes from "../modules/attendance/attendance.route.js";
import enrollmentRoutes from "../modules/enrollments/enrollment.routes.js";
import taskRoutes from "../modules/tasks/task.routes.js";
import submissionRoutes from "../modules/submissions/submission.routes.js";
import progressRoutes from "../modules/progress/progress.routes.js";
import feedbackRoutes from "../modules/feedback/feedback.routes.js";
import reportsRoutes from "../modules/reports/report.route.js";
import notificationsRoutes from "../modules/notification/notification.routes.js";
import groupRoutes from "../modules/groups/group.routes.js";
import resourceRoutes from "../modules/resources/resource.routes.js";
import projectRoutes from "../modules/projects/project.routes.js";

import authRoutes from "../modules/auth/auth.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ message: "API is running" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/divisions", divisionRoutes);
router.use("/bootcamps", bootcampRoutes);


router.use("/attendance", attendanceRoutes);
router.use("/sessions", sessionRoutes);

router.use("/enrollments", enrollmentRoutes);

router.use("/tasks", taskRoutes);
router.use("/submissions", submissionRoutes);
router.use("/progress", progressRoutes);

router.use("/feedback", feedbackRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/reports", reportsRoutes);


router.use("/groups", groupRoutes);
router.use("/resources", resourceRoutes);
router.use("/projects", projectRoutes);
import auditRoutes from "../modules/audit/activity.routes.js";
router.use("/audit", auditRoutes);



export default router;
