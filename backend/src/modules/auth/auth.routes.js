import express from 'express';
import * as authController from './auth.controller.js';

const router = express.Router();

// Maps to POST /api/auth/login
router.post('/login', authController.login);

// Maps to POST /api/auth/refresh
router.post('/refresh', authController.refresh);

export default router;
