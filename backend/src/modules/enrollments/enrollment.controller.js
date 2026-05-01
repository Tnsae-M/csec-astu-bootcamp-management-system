import * as enrollmentService from "./enrollment.service.js";

// POST /enrollments
export const enroll = async (req, res, next) => {
  try {
    const { userId, bootcampId } = req.body;

    const enrollment = await enrollmentService.enrollUser(
      userId || req.user.userId,
      bootcampId
    );

    res.status(201).json({
      success: true,
      message: "User enrolled successfully",
      data: enrollment,
    });
  } catch (err) {
    next(err);
  }
};

// GET /enrollments/bootcamp/:id
export const getBootcampEnrollments = async (req, res, next) => {
  try {
    const data = await enrollmentService.getBootcampEnrollments(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /enrollments/me
export const getMyEnrollments = async (req, res, next) => {
  try {
    const data = await enrollmentService.getMyEnrollments(
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

// PUT /enrollments/:id
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const updated = await enrollmentService.updateEnrollmentStatus(
      req.params.id,
      status
    );

    res.status(200).json({
      success: true,
      message: "Enrollment updated",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};