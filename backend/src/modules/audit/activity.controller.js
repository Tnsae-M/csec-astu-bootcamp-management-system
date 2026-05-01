import * as activityService from './activity.service.js';

export const getActivities = async (req, res, next) => {
  try {
    const activities = await activityService.getActivities(req.query.limit ? parseInt(req.query.limit) : 20);
    res.json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};
