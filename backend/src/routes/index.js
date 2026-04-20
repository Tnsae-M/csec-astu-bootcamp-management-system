import { Router } from "express";
import userRoutes from "../modules/users/user.routes.js";
import sessionRoutes from "../modules/sessions/session.routes.js";
import divisionRoutes from "../modules/divisions/division.route.js";
import bootcampRoutes from "../modules/bootcamps/bootcamp.route.js";
import attendanceRoutes from "../modules/attendance/attendance.route.js";
import authRoutes from "../modules/auth/auth.routes.js";
import tasksRoutes from "../modules/tasks/tasks.routes.js";

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
router.use("/tasks", tasksRoutes);
export default router;
