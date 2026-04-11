import express from 'express';
import * as enrollmentController from './enrollment.controller.js';

const router = express.Router();

// Maps to POST /api/enrollments
router.post('/', enrollmentController.enrollStudent);

// Maps to GET /api/enrollments
router.get('/', enrollmentController.getAllEnrollments);

// Maps to PUT /api/enrollments/:id/status
// We use /status here to specifically denote what we are updating
router.put('/:id/status', enrollmentController.updateStatus);

// Maps to GET /api/enrollments/division/:divisionId
router.get('/division/:divisionId', enrollmentController.getDivisionStudents);

// Maps to GET /api/enrollments/student/:studentId
router.get('/student/:studentId', enrollmentController.getStudentEnrollments);

export default router;
