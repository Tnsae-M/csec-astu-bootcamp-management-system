import { Router } from "express";

const router = Router();
router.get("/health", (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

/**
 * MODULE ROUTES (plug here)
 * Example:
 * import authRoutes from "../modules/auth/auth.routes.js";
 * router.use("/auth", authRoutes);
 */

// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/divisions", divisionRoutes);

export default router;