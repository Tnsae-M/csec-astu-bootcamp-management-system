import Session from './session.model.js';

/**
 * A private helper to enforce the strict Business Rules defined in your SRS
 */
const validateSessionRules = async (sessionData, excludeSessionId = null) => {
  const start = new Date(sessionData.startTime);
  const end = new Date(sessionData.endTime);
  const now = new Date();

  // Rule 1: Scheduled at least 1 hour in advance
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  if (start < oneHourFromNow) {
    const err = new Error('Sessions must be scheduled at least 1 hour in advance');
    err.statusCode = 422; // 422 - Business Rule Violation (from your SRS)
    throw err;
  }

  // Rule 2: Minimum duration of 30 minutes
  const durationMs = end.getTime() - start.getTime();
  if (durationMs < 30 * 60 * 1000) {
    const err = new Error('Session must be at least 30 minutes long');
    err.statusCode = 422;
    throw err;
  }

  // Overlap Database Query Setup
  // We check if (Requested Start < Existing End) AND (Requested End > Existing Start)
  const overlapQuery = {
    startTime: { $lt: end },
    endTime: { $gt: start },
    status: { $ne: 'Cancelled' } // Cancelled sessions don't cause overlaps
  };
  
  if (excludeSessionId) {
    overlapQuery._id = { $ne: excludeSessionId }; // Don't check against the session we are currently editing
  }

  // Rule 3: No overlapping sessions in the same division
  const divisionOverlap = await Session.findOne({ ...overlapQuery, division: sessionData.division });
  if (divisionOverlap) {
    const err = new Error('This division already has a session scheduled during this time');
    err.statusCode = 409; // Conflict
    throw err;
  }

  // Rule 4: Instructor cannot be double-booked
  const instructorOverlap = await Session.findOne({ ...overlapQuery, instructor: sessionData.instructor });
  if (instructorOverlap) {
    const err = new Error('This instructor is already booked for another session at this time');
    err.statusCode = 409;
    throw err;
  }
};


export const createSession = async (sessionData) => {
  // 1. Run all business logic checks
  await validateSessionRules(sessionData);
  
  // 2. If it passes, save it
  const session = new Session(sessionData);
  return await session.save();
};

export const getAllSessions = async (filters = {}) => {
  // populate() joins the Users and Divisions collections so we see names, not just random IDs
  return await Session.find(filters)
    .populate('instructor', 'name email')
    .populate('division', 'name');
};

export const getSessionById = async (sessionId) => {
  const session = await Session.findById(sessionId)
    .populate('instructor', 'name email')
    .populate('division', 'name');
    
  if (!session) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }
  return session;
};

export const updateSession = async (sessionId, updateData) => {
  const sessionToUpdate = await Session.findById(sessionId);
  if (!sessionToUpdate) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  // If the update involves changing the schedule, we MUST re-run validations!
  if (updateData.startTime || updateData.endTime || updateData.division || updateData.instructor) {
    // We mock what the session will look like to test it
    const mergedData = {
      startTime: updateData.startTime || sessionToUpdate.startTime,
      endTime: updateData.endTime || sessionToUpdate.endTime,
      division: updateData.division || sessionToUpdate.division,
      instructor: updateData.instructor || sessionToUpdate.instructor
    };

    // If they aren't cancelling it, ensure the new time is valid
    if (updateData.status !== 'Cancelled') {
      await validateSessionRules(mergedData, sessionId);
    }
  }

  const updatedSession = await Session.findByIdAndUpdate(sessionId, updateData, { 
    new: true, 
    runValidators: true 
  }).populate('instructor', 'name').populate('division', 'name');
  
  // Notice: Your SRS says "Session cancelled -> Urgent notification". 
  // TODO: We will trigger your Notification System here later when the status changes to Cancelled!

  return updatedSession;
};
