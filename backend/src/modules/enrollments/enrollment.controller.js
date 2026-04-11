import * as enrollmentService from './enrollment.service.js';

/**
 * @desc    Enroll a student into a division
 * @route   POST /api/enrollments
 * @access  Private (Admin)
 */
export const enrollStudent = async (req, res, next) => {
  try {
    const { studentId, divisionId } = req.body;
    
    // Some basic upfront validation
    if (!studentId || !divisionId) {
      const error = new Error('Both studentId and divisionId are required');
      error.statusCode = 400;
      throw error;
    }

    const enrollment = await enrollmentService.enrollStudent(studentId, divisionId);
    
    res.status(201).json({
      success: true,
      message: 'Student successfully enrolled',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an enrollment status (e.g. drop a student)
 * @route   PUT /api/enrollments/:id/status
 * @access  Private (Admin)
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      const error = new Error('Please provide a status update');
      error.statusCode = 400;
      throw error;
    }

    const enrollment = await enrollmentService.updateEnrollmentStatus(req.params.id, status);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment status updated',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active students in a specific division
 * @route   GET /api/enrollments/division/:divisionId
 * @access  Private (Admin / Instructor)
 */
export const getDivisionStudents = async (req, res, next) => {
  try {
    const students = await enrollmentService.getDivisionStudents(req.params.divisionId);
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all divisions a specific student is enrolled in
 * @route   GET /api/enrollments/student/:studentId
 * @access  Private (Student / Admin)
 */
export const getStudentEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getStudentEnrollments(req.params.studentId);
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all enrollments
 * @route   GET /api/enrollments
 * @access  Private (Admin)
 */
export const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};
