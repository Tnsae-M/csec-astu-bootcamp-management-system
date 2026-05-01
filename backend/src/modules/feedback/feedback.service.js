import Feedback from "./feedback.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import Session from "../sessions/session.model.js";
import Attendance from "../attendance/attendance.model.js";

const buildError = (msg, code = 400) => {
  const err = new Error(msg);
  err.statusCode = code;
  return err;
};

//  Create feedback
export const createFeedback = async (data, studentId) => {
  const { bootcampId, sessionId, instructorId, rating, isAnonymous = true } = data;

  // 1. Enforce Feedback Window (48 hours after session ends)
  if (sessionId) {
    const session = await Session.findById(sessionId);
    if (!session) throw buildError("Session not found", 404);

    const now = Date.now();
    const endTime = session.endTime.getTime();
    const diff = now - endTime;

    if (diff < 0) throw buildError("Feedback cannot be submitted before session ends", 400);
    if (diff > 48 * 60 * 60 * 1000) {
      throw buildError("Feedback window has closed (48 hours expired)", 403);
    }

    // 2. Only present/late students can submit
    const attendance = await Attendance.findOne({ sessionId, userId: studentId });
    if (!attendance || !['present', 'late'].includes(attendance.status.toLowerCase())) {
      throw buildError("Feedback restricted to students who attended the session", 403);
    }
  }

  //  Must be enrolled if bootcamp feedback
  if (bootcampId) {
    const enrollment = await Enrollment.findOne({
      userId: studentId,
      bootcampId,
    });

    if (!enrollment) {
      throw buildError("You are not enrolled in this bootcamp", 403);
    }
  }

  //  prevent duplicate
  const existing = await Feedback.findOne({
    studentId,
    bootcampId,
    sessionId,
  });

  if (existing) {
    throw buildError("Feedback already submitted", 409);
  }

  if (rating < 1 || rating > 5) {
    throw buildError("Rating must be between 1 and 5");
  }

  return await Feedback.create({
    ...data,
    studentId,
    isAnonymous,
  });
};

//  Get feedback for bootcamp
export const getBootcampFeedback = async (bootcampId, viewerRole = 'instructor') => {
  const data = await Feedback.find({ bootcampId })
    .populate("studentId", "name")
    .sort({ createdAt: -1 });

  return data.map((d) => ({
    id: d._id,
    sessionId: d.sessionId,
    rating: d.rating,
    comment: d.comment,
    createdAt: d.createdAt,
    isAnonymous: d.isAnonymous,
    studentName: viewerRole === 'admin' ? d.studentId?.name || null : (d.isAnonymous ? 'Anonymous' : d.studentId?.name || null),
  }));
};

//  Get feedback for instructor
export const getInstructorFeedback = async (instructorId, viewerRole = 'instructor') => {
  const data = await Feedback.find({ instructorId })
    .populate("studentId", "name")
    .sort({ createdAt: -1 });

  return data.map((d) => ({
    id: d._id,
    sessionId: d.sessionId,
    rating: d.rating,
    comment: d.comment,
    createdAt: d.createdAt,
    isAnonymous: d.isAnonymous,
    studentName: viewerRole === 'admin' ? d.studentId?.name || null : (d.isAnonymous ? 'Anonymous' : d.studentId?.name || null),
  }));
};

export const getSessionFeedback = async (sessionId, viewerRole = 'instructor') => {
  const data = await Feedback.find({ sessionId })
    .populate("studentId", "name")
    .sort({ createdAt: -1 });

  return data.map((d) => ({
    id: d._id,
    sessionId: d.sessionId,
    rating: d.rating,
    comment: d.comment,
    createdAt: d.createdAt,
    isAnonymous: d.isAnonymous,
    studentName: viewerRole === 'admin' ? d.studentId?.name || null : (d.isAnonymous ? 'Anonymous' : d.studentId?.name || null),
  }));
};