import * as submissionService from "./submission.service.js";

// POST /submissions
export const submitTask = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.fileUrl = `/uploads/${req.file.filename}`;
    }
    const submission = await submissionService.submitTask(
      data,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "Task submitted",
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

// GET /submissions/me
export const getMySubmissions = async (req, res, next) => {
  try {
    const data = await submissionService.getMySubmissions(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /submissions/task/:taskId
export const getSubmissionsByTask = async (req, res, next) => {
  try {
    const data = await submissionService.getSubmissionsByTask(
      req.params.taskId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /submissions/:id/grade
export const gradeSubmission = async (req, res, next) => {
  try {
    const data = await submissionService.gradeSubmission(
      req.params.id,
      req.body,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Submission graded",
      data,
    });
  } catch (err) {
    next(err);
  }
};