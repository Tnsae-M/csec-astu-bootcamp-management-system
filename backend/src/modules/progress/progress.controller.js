import * as progressService from './progress.service.js';

/**
 * @desc    Submit a weekly progress report for a group
 * @route   POST /api/progress
 * @access  Private (Student)
 */
export const submitProgress = async (req, res, next) => {
  try {
    const progress = await progressService.submitProgress(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Weekly progress submitted successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a weekly progress report
 * @route   PUT /api/progress/:id
 * @access  Private (Student)
 */
export const updateProgress = async (req, res, next) => {
  try {
    const progress = await progressService.updateProgress(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Progress report updated successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all historical progress reports for a specific group
 * @route   GET /api/progress/group/:groupId
 * @access  Private (Instructor / Admin / Students in that group)
 */
export const getGroupProgress = async (req, res, next) => {
  try {
    const progressLogs = await progressService.getGroupProgress(req.params.groupId);
    
    res.status(200).json({
      success: true,
      count: progressLogs.length,
      data: progressLogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all progress reports
 * @route   GET /api/progress
 * @access  Private (Admin)
 */
export const getAllProgress = async (req, res, next) => {
  try {
    const progressLogs = await progressService.getAllProgress();
    
    res.status(200).json({
      success: true,
      count: progressLogs.length,
      data: progressLogs
    });
  } catch (error) {
    next(error);
  }
};
