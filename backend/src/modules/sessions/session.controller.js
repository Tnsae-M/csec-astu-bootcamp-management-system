import * as sessionService from './session.service.js';

/**
 * @desc    Create a new session
 * @route   POST /api/sessions
 * @access  Private (Instructor / Admin)
 */
export const createSession = async (req, res, next) => {
  try {
    const session = await sessionService.createSession(req.body);
    
    // Notice SRS "Session created -> Students notified". 
    // We will trigger that Notification logic here or in the Service layer later.

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all sessions
 * @route   GET /api/sessions
 * @access  Private (All Users)
 */
export const getAllSessions = async (req, res, next) => {
  try {
    // We allow fetching sessions filtered by division or instructor if provided
    const filters = {};
    if (req.query.division) filters.division = req.query.division;
    if (req.query.instructor) filters.instructor = req.query.instructor;
    if (req.query.status) filters.status = req.query.status;

    const sessions = await sessionService.getAllSessions(filters);
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single session
 * @route   GET /api/sessions/:id
 * @access  Private (All Users)
 */
export const getSessionById = async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update/Cancel a session
 * @route   PUT /api/sessions/:id
 * @access  Private (Instructor / Admin)
 */
export const updateSession = async (req, res, next) => {
  try {
    const session = await sessionService.updateSession(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    next(error);
  }
};
