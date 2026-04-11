import express from 'express';
import * as submissionController from './submission.controller.js';

const router = express.Router();

// Maps to POST /api/submissions
router.post('/', submissionController.submitWork);

// Maps to PUT /api/submissions/:id/grade
router.put('/:id/grade', submissionController.gradeSubmission);

// Maps to GET /api/submissions
router.get('/', submissionController.getAllSubmissions);

// Maps to GET /api/submissions/task/:taskId
router.get('/task/:taskId', submissionController.getSubmissionsForTask);

// Maps to GET /api/submissions/student/:studentId
router.get('/student/:studentId', submissionController.getStudentSubmissions);

export default router;
