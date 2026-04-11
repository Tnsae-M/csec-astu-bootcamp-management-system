import express from 'express';
import * as feedbackController from './feedback.controller.js';

const router = express.Router();

// Maps to POST /api/feedback
router.post('/', feedbackController.submitFeedback);

// Maps to GET /api/feedback
router.get('/', feedbackController.getAllFeedback);

// Maps to GET /api/feedback/session/:sessionId
router.get('/session/:sessionId', feedbackController.getSessionFeedback);

export default router;
