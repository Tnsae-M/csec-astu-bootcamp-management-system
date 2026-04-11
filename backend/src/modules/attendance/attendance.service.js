import Attendance from './attendance.model.js';
import Session from '../sessions/session.model.js';
import Enrollment from '../enrollments/enrollment.model.js';

export const markAttendance = async (attendanceData) => {
  const { session: sessionId, student, status, note, markedBy } = attendanceData;

  // 1. Fetch the session to confirm it exists and check its times
  const session = await Session.findById(sessionId);
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  // NEW: Verify the student is actually enrolled in this session's division
  const enrollment = await Enrollment.findOne({ 
    student: student, 
    division: session.division,
    status: 'Active'
  });
  
  if (!enrollment) {
    const error = new Error('Student is not actively enrolled in this division');
    error.statusCode = 403; // Forbidden
    throw error;
  }

  // 2. Rule: Excused requires note
  if (status === 'Excused' && (!note || note.trim() === '')) {
    const error = new Error('An excused absence requires a written note');
    error.statusCode = 422; // Business Rule Violation
    throw error;
  }

  // 3. Rule: Late if >10 minutes
  let finalStatus = status;
  if (status === 'Present') {
    const sessionStart = new Date(session.startTime).getTime();
    const now = Date.now();
    
    // If checking in more than 10 mins (600,000 ms) after start time
    if (now - sessionStart > 10 * 60 * 1000) {
      finalStatus = 'Late'; // Automatically downgrade to Late
    }
  }

  // 4. Save record (MongoDB unique index handles duplicate checking for us!)
  const attendance = new Attendance({
    session: sessionId,
    student,
    status: finalStatus,
    note,
    markedBy
  });

  return await attendance.save();
};

export const updateAttendance = async (attendanceId, updateData) => {
  // We need to populate the session so we can read its endTime
  const attendance = await Attendance.findById(attendanceId).populate('session');
  if (!attendance) {
    const error = new Error('Attendance record not found');
    error.statusCode = 404;
    throw error;
  }

  // Rule: Editable within 24 hours (we measure from session end time)
  const sessionEnd = new Date(attendance.session.endTime).getTime();
  const timeSinceSessionEnd = Date.now() - sessionEnd;
  
  if (timeSinceSessionEnd > 24 * 60 * 60 * 1000) {
    const error = new Error('Attendance can only be edited within 24 hours after the session ends');
    error.statusCode = 422;
    throw error;
  }
  
  // Re-verify the excused note rule on updates
  if (updateData.status === 'Excused' && !updateData.note && !attendance.note) {
    const error = new Error('An excused absence requires a written note');
    error.statusCode = 422;
    throw error;
  }

  return await Attendance.findByIdAndUpdate(attendanceId, updateData, {
    new: true,
    runValidators: true
  });
};

export const getSessionAttendance = async (sessionId) => {
  return await Attendance.find({ session: sessionId })
    .populate('student', 'name email role')
    .populate('markedBy', 'name');
};

export const getStudentAttendance = async (studentId) => {
  return await Attendance.find({ student: studentId })
    .populate('session', 'title startTime endTime status');
};

export const getAllAttendance = async () => {
  return await Attendance.find()
    .populate('student', 'name email')
    .populate('session', 'title startTime endTime');
};
