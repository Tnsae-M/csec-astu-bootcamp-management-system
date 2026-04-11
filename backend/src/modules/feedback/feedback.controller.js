import * as feedbackService from './feedback.service.js';

/**
 * @desc    Submit feedback for a session
 * @route   POST /api/feedback
 * @access  Private (Student)
 */
export const submitFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.submitFeedback(req.body);
    
    // According to the SRS, instructors shouldn't see who made the rating.
    // However, the student who just submitted it can know they submitted it!
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all anonymous feedback for a specific session
 * @route   GET /api/feedback/session/:sessionId
 * @access  Private (Instructor / Admin)
 */
export const getSessionFeedback = async (req, res, next) => {
  try {
    const feedbacks = await feedbackService.getSessionFeedback(req.params.sessionId);
    
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      // The data provided here has the student ID completely stripped out
      data: feedbacks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all feedback
 * @route   GET /api/feedback
 * @access  Private (Admin)
 */
export const getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await feedbackService.getAllFeedback();
    
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    next(error);
  }
};
