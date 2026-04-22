import Feedback from "./feedback.model.js";
import Enrollment from "../enrollments/enrollment.model.js";

const buildError = (msg, code = 400) => {
  const err = new Error(msg);
  err.statusCode = code;
  return err;
};

//  Create feedback
export const createFeedback = async (data, studentId) => {
  const { bootcampId, sessionId, instructorId, rating } = data;

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
  });
};

//  Get feedback for bootcamp
export const getBootcampFeedback = async (bootcampId) => {
  return await Feedback.find({ bootcampId })
    .populate("studentId", "name")
    .sort({ createdAt: -1 });
};

//  Get feedback for instructor
export const getInstructorFeedback = async (instructorId) => {
  return await Feedback.find({ instructorId })
    .populate("studentId", "name")
    .sort({ createdAt: -1 });
};