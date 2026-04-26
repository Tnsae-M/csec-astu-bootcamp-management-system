import * as feedbackService from "./feedback.service.js";

// POST /feedback
export const createFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.createFeedback(
      req.body,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "Feedback submitted",
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
};

// GET /feedback/bootcamp/:id
export const getBootcampFeedback = async (req, res, next) => {
  try {
    const viewerRole = (req.user?.role || '').toLowerCase();
    const data = await feedbackService.getBootcampFeedback(
      req.params.id,
      viewerRole
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /feedback/instructor/:id
export const getInstructorFeedback = async (req, res, next) => {
  try {
    const viewerRole = (req.user?.role || '').toLowerCase();
    const data = await feedbackService.getInstructorFeedback(
      req.params.id,
      viewerRole
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};