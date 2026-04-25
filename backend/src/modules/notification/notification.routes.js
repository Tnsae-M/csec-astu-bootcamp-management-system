import express from "express";
import { createNotification, getNotification, markAsRead } from "./notification.controllers.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = express.Router();

router.post("/", authGuard, roleGuard(["admin", "instructor"]), createNotification);
router.get("/:id", authGuard, roleGuard(["admin", "instructor", "student"]), getNotification);
router.patch("/:id", authGuard, roleGuard(["admin", "instructor", "student"]), markAsRead);

export default router; 
