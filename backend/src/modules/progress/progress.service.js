import Progress from './progress.model.js';
import Group from '../groups/group.model.js';

export const submitProgress = async (progressData) => {
  const { group: groupId, submittedBy, weekNumber } = progressData;

  // 1. Verify group exists
  const group = await Group.findById(groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. SECURITY CHECK: Verify the student making the submission actually belongs to this group
  const isMember = group.members.some(memberId => memberId.toString() === submittedBy.toString());
  if (!isMember) {
    const error = new Error('You are not authorized to submit a progress update for a group you do not belong to');
    error.statusCode = 403; // Forbidden
    throw error;
  }

  const progress = new Progress(progressData);

  try {
    return await progress.save();
  } catch (err) {
    // Catch the duplicate key index error safely
    if (err.code === 11000) {
      const error = new Error(`Your group has already submitted a progress report for Week ${weekNumber}`);
      error.statusCode = 409;
      throw error;
    }
    throw err; // Re-throw other errors (like the 50 char validation error)
  }
};

export const updateProgress = async (progressId, updateData) => {
  // Prevent them from tampering with the core identity of the report
  if (updateData.group || updateData.weekNumber) {
    const error = new Error('You cannot change the group or week number of an existing report. Please delete it and rewrite it if needed.');
    error.statusCode = 400;
    throw error;
  }

  const progress = await Progress.findByIdAndUpdate(progressId, updateData, {
    new: true,
    runValidators: true // Enforces the 50 character rule again upon update
  });

  if (!progress) {
    const error = new Error('Progress report not found');
    error.statusCode = 404;
    throw error;
  }
  
  return progress;
};

export const getGroupProgress = async (groupId) => {
  // Sort by weekNumber so the Instructor reads them in chronological order
  return await Progress.find({ group: groupId })
    .sort({ weekNumber: 1 })
    .populate('submittedBy', 'name email');
};

export const getAllProgress = async () => {
  return await Progress.find()
    .populate('group', 'name')
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 });
};
