import * as attendanceService from './attendance.service.js';

/**
 * @desc    Mark attendance for a session
 * @route   POST /api/attendance
 * @access  Private (Student checking in, or Instructor marking)
 */
export const markAttendance = async (req, res, next) => {
  try {
    // We pass req.body which contains session, student, status, note, etc.
    const attendance = await attendanceService.markAttendance(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing attendance record
 * @route   PUT /api/attendance/:id
 * @access  Private (Instructor or Admin overriding)
 */
export const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.updateAttendance(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all attendance records for a specific session
 * @route   GET /api/attendance/session/:sessionId
 * @access  Private (Instructor reading class register)
 */
export const getSessionAttendance = async (req, res, next) => {
  try {
    const records = await attendanceService.getSessionAttendance(req.params.sessionId);
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all attendance records for a specific student
 * @route   GET /api/attendance/student/:studentId
 * @access  Private (Student viewing their history, or Admin report)
 */
export const getStudentAttendance = async (req, res, next) => {
  try {
    const records = await attendanceService.getStudentAttendance(req.params.studentId);
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all attendance records
 * @route   GET /api/attendance
 * @access  Private (Admin)
 */
export const getAllAttendance = async (req, res, next) => {
  try {
    const records = await attendanceService.getAllAttendance();
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};
