import express from 'express';
import * as progressController from './progress.controller.js';

const router = express.Router();

// Maps to POST /api/progress
router.post('/', progressController.submitProgress);

// Maps to PUT /api/progress/:id
router.put('/:id', progressController.updateProgress);

// Maps to GET /api/progress
router.get('/', progressController.getAllProgress);

// Maps to GET /api/progress/group/:groupId
router.get('/group/:groupId', progressController.getGroupProgress);

export default router;
