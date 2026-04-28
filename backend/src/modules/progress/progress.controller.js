import * as progressService from "./progress.service.js";

export const getMyProgress = async (req, res, next) => {
  try {
    const data = await progressService.getMyProgress(
      req.user.userId,
      req.params.bootcampId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};