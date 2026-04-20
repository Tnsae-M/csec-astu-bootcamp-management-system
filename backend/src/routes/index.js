
import { Router } from "express";
import userRoutes from "../modules/users/user.routes.js";
import sessionRoutes from "../modules/sessions/session.routes.js";
import divisionRoutes from "../modules/divisions/division.route.js";
import bootcampRoutes from "../modules/bootcamps/bootcamp.route.js";
import attendanceRoutes from "../modules/attendance/attendance.route.js";

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
//========================================
//EXAMPLE
/**
 * MODULE ROUTES (plug here)
 * Example:
 * import authRoutes from "../modules/auth/auth.routes.js";
 * router.use("/auth", authRoutes);
 */
//========================================

// export default router;
// import express from "express";

// const router = express.Router();

// TEMP DATABASE (in-memory)
let sessions = [];

// GET all sessions
router.get("/sessions", (req, res) => {
  res.json(sessions); // MUST be array
});

// CREATE session
router.post("/sessions", (req, res) => {
  const newSession = {
    id: Date.now().toString(),
    title: req.body.title,
  };

  sessions.push(newSession);

  res.status(201).json(newSession);
});

// DELETE session
router.delete("/sessions/:id", (req, res) => {
  const { id } = req.params;

  sessions = sessions.filter((s) => s.id !== id);

  res.json({ message: "Deleted successfully" });
});

// import express from "express";

// const router = express.Router();

// // TEMP in-memory storage
// let sessions = [];

// /* =========================
//    CREATE (POST)
// ========================= */
// router.post("/sessions", (req, res) => {
//   const newSession = {
//     id: Date.now(),
//     ...req.body,
//   };

//   sessions.push(newSession);

//   res.json({
//     message: "Session created successfully",
//     data: newSession,
//   });
// });

// /* =========================
//    READ ALL (GET)
// ========================= */
// router.get("/sessions", (req, res) => {
//   res.json({
//     message: "All sessions",
//     data: sessions,
//   });
// });

// /* =========================
//    READ ONE (GET by ID)
// ========================= */
// router.get("/sessions/:id", (req, res) => {
//   const session = sessions.find(s => s.id == req.params.id);

//   if (!session) {
//     return res.status(404).json({ message: "Session not found" });
//   }

//   res.json(session);
// });

// /* =========================
//    UPDATE (PUT)
// ========================= */
// router.put("/sessions/:id", (req, res) => {
//   const index = sessions.findIndex(s => s.id == req.params.id);

//   if (index === -1) {
//     return res.status(404).json({ message: "Session not found" });
//   }

//   sessions[index] = {
//     ...sessions[index],
//     ...req.body,
//   };

//   res.json({
//     message: "Session updated",
//     data: sessions[index],
//   });
// });

// /* =========================
//    DELETE
// ========================= */
// router.delete("/sessions/:id", (req, res) => {
//   sessions = sessions.filter(s => s.id != req.params.id);

//   res.json({
//     message: "Session deleted",
//   });
// });

// export default router; origin/session-feature

router.use("/sessions", sessionRoutes);

export default router;
