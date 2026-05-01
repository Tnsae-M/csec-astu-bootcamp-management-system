import express from 'express';
import * as activityController from './activity.controller.js';
import { authGuard, roleGuard } from '../../middleware/role.guard.js';

const router = express.Router();

router.get('/', authGuard, roleGuard(['ADMIN', 'SUPER ADMIN']), activityController.getActivities);

export default router;
