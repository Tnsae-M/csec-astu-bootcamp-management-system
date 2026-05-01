import * as submissionService from "./submission.service.js";

// POST /submissions
export const submitTask = async (req, res, next) => {
  try {
    let submissionData;
    
    // Handle both FormData and regular JSON submissions
    if (req.file) {
      // File upload case - reconstruct data from FormData
      submissionData = {
        taskId: req.body.taskId,
        type: req.body.type,
        link: req.body.link,
        text: req.body.text,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      };
    } else {
      // Regular JSON case
      submissionData = req.body;
    }

    const submission = await submissionService.submitTask(
      submissionData,
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