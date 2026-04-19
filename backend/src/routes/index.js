import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import divisionRoutes from "../modules/divisions/division.route.js";
import bootcampRoutes from "../modules/bootcamps/bootcamp.route.js";
const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
router.use("/divisions", divisionRoutes);
router.use("/bootcamps", bootcampRoutes);
//========================================
//EXAMPLE
/**
 * MODULE ROUTES (plug here)
 * Example:
 * import authRoutes from "../modules/auth/auth.routes.js";
 * router.use("/auth", authRoutes);
 */
//========================================

export default router;
