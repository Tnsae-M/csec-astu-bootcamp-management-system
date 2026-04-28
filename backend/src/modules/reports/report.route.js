import express from 'express';
import * as controller from './report.controller.js';
import { authGuard, roleGuard } from '../../middleware/role.guard.js';

const router = express.Router();

router.use(authGuard);
router.get('/', roleGuard('admin'), controller.getReports);
router.post('/', roleGuard('admin'), controller.createReport);
router.get('/:id', roleGuard('admin'), controller.getReport);
router.put('/:id', roleGuard('admin'), controller.updateReport);
router.delete('/:id', roleGuard('admin'), controller.deleteReport);

export default router;
