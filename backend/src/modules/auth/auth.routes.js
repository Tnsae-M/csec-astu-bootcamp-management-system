import {login,register} from './auth.controller.js';
import { Router } from "express";
const router = Router();
//login route for users to login
router.post("/login",login);
//admin route to create new users
router.post("/register",register);

export default router;