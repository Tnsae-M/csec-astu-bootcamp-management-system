import * as submissionService from './submission.service.js';

/**
 * @desc    Submit or resubmit a task assignment
 * @route   POST /api/submissions
 * @access  Private (Student)
 */
export const submitWork = async (req, res, next) => {
  try {
    // req.body should contain { task, student, fileUrl, githubUrl }
    const submission = await submissionService.submitWork(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Work submitted successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Grade a student's submission
 * @route   PUT /api/submissions/:id/grade
 * @access  Private (Instructor)
 */
export const gradeSubmission = async (req, res, next) => {
  try {
    // req.body should contain { score, feedback, status }
    const submission = await submissionService.gradeSubmission(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions for an assignment
 * @route   GET /api/submissions/task/:taskId
 * @access  Private (Instructor / Admin)
 */
export const getSubmissionsForTask = async (req, res, next) => {
  try {
    const submissions = await submissionService.getSubmissionsForTask(req.params.taskId);
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions made by a specific student
 * @route   GET /api/submissions/student/:studentId
 * @access  Private (Student / Admin)
 */
export const getStudentSubmissions = async (req, res, next) => {
  try {
    const submissions = await submissionService.getStudentSubmissions(req.params.studentId);
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions
 * @route   GET /api/submissions
 * @access  Private (Admin)
 */
export const getAllSubmissions = async (req, res, next) => {
  try {
    const submissions = await submissionService.getAllSubmissions();
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};
