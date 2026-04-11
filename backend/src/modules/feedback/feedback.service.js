import Feedback from './feedback.model.js';
import Session from '../sessions/session.model.js';
import Attendance from '../attendance/attendance.model.js';

export const submitFeedback = async (feedbackData) => {
  const { session: sessionId, student, rating, comment } = feedbackData;

  // 1. Ensure the session exists
  const session = await Session.findById(sessionId);
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Business Rule: Time window 48 hours AFTER session ends
  const sessionEnd = new Date(session.endTime).getTime();
  const timeSinceEnd = Date.now() - sessionEnd;
  
  if (timeSinceEnd < 0) {
    const error = new Error('You cannot rate a session before it has finished');
    error.statusCode = 422; // Business Rule Violation
    throw error;
  }
  
  if (timeSinceEnd > 48 * 60 * 60 * 1000) {
    const error = new Error('The 48-hour feedback window for this session has completely closed');
    error.statusCode = 422;
    throw error;
  }

  // 3. Business Rule: Only Present or Late students can submit
  // We explicitly check the Attendance model
  const attendance = await Attendance.findOne({ session: sessionId, student: student });
  
  if (!attendance) {
    const error = new Error('You cannot submit feedback. You do not have an attendance record for this session.');
    error.statusCode = 403; // Forbidden
    throw error;
  }
  
  if (attendance.status === 'Absent' || attendance.status === 'Excused') {
    const error = new Error('Only students who physically attended the session (Present/Late) can rate it.');
    error.statusCode = 403;
    throw error;
  }

  // 4. Save the feedback
  const feedback = new Feedback({
    session: sessionId,
    student,
    rating,
    comment
  });

  try {
    return await feedback.save();
  } catch (err) {
    // If MongoDB throws a 11000 error, it means they violated our unique index
    if (err.code === 11000) {
      const error = new Error('You have already submitted feedback for this session');
      error.statusCode = 409; // Conflict
      throw error;
    }
    throw err;
  }
};

/**
 * Get feedback for a session
 * SRS IMPORTANT RULE: "Anonymous to instructors"
 */
export const getSessionFeedback = async (sessionId) => {
  return await Feedback.find({ session: sessionId })
    .select('-student') // SECURITY: We forcibly remove the student ID from the results!
    .sort({ createdAt: -1 }); // Show newest first
};

export const getAllFeedback = async () => {
  return await Feedback.find()
    .populate('session', 'title startTime')
    .select('-student')
    .sort({ createdAt: -1 });
};
