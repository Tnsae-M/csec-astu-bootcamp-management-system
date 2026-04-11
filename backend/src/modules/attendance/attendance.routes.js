import express from 'express';
import * as attendanceController from './attendance.controller.js';

const router = express.Router();

// Maps to POST /api/attendance 
router.post('/', attendanceController.markAttendance);

// Maps to PUT /api/attendance/:id
router.put('/:id', attendanceController.updateAttendance);

// Maps to GET /api/attendance
router.get('/', attendanceController.getAllAttendance);

// Maps to GET /api/attendance/session/:sessionId
router.get('/session/:sessionId', attendanceController.getSessionAttendance);

// Maps to GET /api/attendance/student/:studentId
router.get('/student/:studentId', attendanceController.getStudentAttendance);

export default router;
