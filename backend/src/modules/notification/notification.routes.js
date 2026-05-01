import express from "express";
import { createNotification, getNotification, getMyNotifications, markAsRead } from "./notification.controllers.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = express.Router();

// GET /notification — fetch all notifications for the current user
router.get("/", authGuard, getMyNotifications);
router.post("/", authGuard, roleGuard(["admin", "instructor"]), createNotification);
router.get("/:id", authGuard, getNotification);
router.patch("/:id", authGuard, markAsRead);

export default router; 
