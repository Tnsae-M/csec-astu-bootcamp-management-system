import Feedback from "./feedback.model.js";
import Enrollment from "../enrollments/enrollment.model.js";

const buildError = (msg, code = 400) => {
  const err = new Error(msg);
  err.statusCode = code;
  return err;
};

//  Create feedback
export const createFeedback = async (data, studentId) => {
  const { bootcampId, sessionId, instructorId, rating, isAnonymous = true } = data;

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