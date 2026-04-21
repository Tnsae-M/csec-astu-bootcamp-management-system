import Feedback from "./feedback.model.js";
import Session from "../sessions/session.model.js";
import Attendance from "../attendance/attendance.model.js";

// ==========================
// STUDENT: CREATE FEEDBACK
// ==========================
export const createFeedback = async (user, data) => {
  const { sessionId, rating, comment } = data;

  // Only students
  if (user.role !== "student") {
    const error = new Error("Only students can submit feedback");
    error.statusCode = 403;
    throw error;
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    const error = new Error("Rating must be between 1 and 5");
    error.statusCode = 400;
    throw error;
  }

  // Check session
  const session = await Session.findById(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.statusCode = 404;
    throw error;
  }

  // Must be after session end
  const now = new Date();
  if (session.endTime > now) {
    const error = new Error("Session has not ended yet");
    error.statusCode = 422;
    throw error;
  }

  // 48-hour rule
  const diffHours = (now - session.endTime) / (1000 * 60 * 60);
  if (diffHours > 48) {
    const error = new Error("Feedback window expired");
    error.statusCode = 422;
    throw error;
  }

  // Check attendance
  const attendance = await Attendance.findOne({
    session: sessionId,
    user: user.userId,
  });

  if (!attendance) {
    const error = new Error("No attendance record found");
    error.statusCode = 403;
    throw error;
  }

  if (!["present", "late"].includes(attendance.status)) {
    const error = new Error("Only present/late students can give feedback");
    error.statusCode = 403;
    throw error;
  }

  // Create feedback
  const feedback = await Feedback.create({
    session: sessionId,
    user: user.userId,
    rating,
    comment,
  });

  return feedback;
};

// ==========================
// INSTRUCTOR: GET FEEDBACK
// ==========================
export const getSessionFeedback = async (sessionId) => {
  const feedbacks = await Feedback.find({ session: sessionId }).select(
    "rating comment createdAt"
  );

  if (!feedbacks.length) {
    return {
      totalFeedbacks: 0,
      averageRating: 0,
      feedbacks: [],
    };
  }

  const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
  const average = total / feedbacks.length;

  return {
    totalFeedbacks: feedbacks.length,
    averageRating: Number(average.toFixed(2)),
    feedbacks,
  };
};