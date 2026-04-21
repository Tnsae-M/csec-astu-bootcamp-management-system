import { createFeedback, getSessionFeedback } from "./feedback.service.js";

// Student submit feedback
export const submitFeedback = async (req, res, next) => {
  try {
    const feedback = await createFeedback(req.user, req.body);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// Instructor view feedback
export const getFeedbackBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const data = await getSessionFeedback(sessionId);

    res.status(200).json({
      success: true,
      message: "Session feedback retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};