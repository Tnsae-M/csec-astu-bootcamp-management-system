import Submission from "./submission.model.js";
import Task from "../tasks/task.model.js";
import Enrollment from "../enrollments/enrollment.model.js";

const buildError = (msg, code = 400) => {
  const err = new Error(msg);
  err.statusCode = code;
  return err;
};

//  Submit task
export const submitTask = async (data, userId) => {
  // Extract data from processed controller
  const { taskId, type, link, text, fileUrl } = data;

  if (!taskId) {
    throw buildError("Task ID is required", 400);
  }

  // Build content based on submission type
  let content;
  if (type === 'link' && link) {
    content = link;
  } else if (type === 'text' && text) {
    content = text;
  } else if (type === 'both' && link) {
    content = `Link: ${link}${text ? `\nText: ${text}` : ''}`;
  } else if (type === 'file') {
    content = fileUrl || 'File uploaded';
  } else {
    content = text || link || 'Submission';
  }

  const task = await Task.findById(taskId);
  if (!task) throw buildError("Task not found", 404);

  //  Must be enrolled
  const enrollment = await Enrollment.findOne({
    userId,
    bootcampId: task.bootcampId,
  });

  if (!enrollment) {
    throw buildError("You are not enrolled in this bootcamp", 403);
  }

  //  Prevent duplicate
  const existing = await Submission.findOne({ taskId, studentId: userId });
  if (existing) {
    throw buildError("You already submitted this task", 409);
  }

  //  Late submission check
  let status = "submitted";
  if (new Date() > new Date(task.dueDate)) {
    status = "late";
  }

  return await Submission.create({
    taskId,
    studentId: userId,
    content,
    fileUrl,
    type,
    status,
  });
};

//  Get my submissions
export const getMySubmissions = async (userId) => {
  return await Submission.find({ studentId: userId })
    .populate("taskId", "title dueDate maxScore")
    .sort({ createdAt: -1 });
};

//  Get submissions for a task (instructor)
export const getSubmissionsByTask = async (taskId) => {
  return await Submission.find({ taskId })
    .populate("studentId", "name email")
    .sort({ createdAt: -1 });
};

//  Grade submission
export const gradeSubmission = async (submissionId, data, instructorId) => {
  const { score, feedback } = data;

  const submission = await Submission.findById(submissionId);
  if (!submission) throw buildError("Submission not found", 404);

  submission.score = score;
  submission.feedback = feedback;
  submission.status = "graded";
  submission.gradedBy = instructorId;

  await submission.save();

  return submission;
};