import express from 'express';
import * as controller from './report.controller.js';
import { authGuard, roleGuard } from '../../middleware/role.guard.js';

const router = express.Router();

router.use(authGuard);
router.get('/', roleGuard('admin', 'super admin'), controller.getReports);
router.post('/', roleGuard('admin', 'super admin'), controller.createReport);
router.get('/:id', roleGuard('admin','super admin'), controller.getReport);
router.put('/:id', roleGuard('admin', 'super admin'), controller.updateReport);
router.delete('/:id', roleGuard('super admin'), controller.deleteReport);

export default router;
