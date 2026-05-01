import Activity from './activity.model.js';

export const logActivity = async (data) => {
  try {
    const activity = new Activity(data);
    return await activity.save();
  } catch (error) {
    console.error('Failed to log activity', error);
  }
};

export const getActivities = async (limit = 20) => {
  return await Activity.find()
    .sort({ createdAt: -1 })
    .limit(limit);
};
