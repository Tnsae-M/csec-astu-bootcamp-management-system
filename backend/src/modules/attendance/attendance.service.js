import Attendance from "./attendance.model.js";
import Session from "../sessions/session.model.js";

const buildError = (msg, code = 400) => {
  const err = new Error(msg);
  err.statusCode = code;
  return err;
};

export const markAttendance = async (data) => {
  const { sessionId, userId, status } = data;

  if (!sessionId || !userId || !status) {
    throw buildError("Session ID, User ID, and Status are required", 400);
  }

  // 1. Prevent Duplicates
  const existing = await Attendance.findOne({ sessionId, userId });
  if (existing) {
    throw buildError("Attendance record already exists for this student in this session", 409);
  }

  // 2. Automated "Late" logic if status is 'present'
  if (status.toLowerCase() === 'present') {
    const session = await Session.findById(sessionId);
    if (session) {
      const tenMinsAfterStart = new Date(session.startTime.getTime() + 10 * 60 * 1000);
      if (Date.now() > tenMinsAfterStart.getTime()) {
        data.status = 'late';
      }
    }
  }

  return await Attendance.create(data);
};

export const updateAttendance = async (id, data) => {
  const attendance = await Attendance.findById(id);
  if (!attendance) throw buildError("Record not found", 404);

  // 3. 24-hour edit window
  const oneDayInMs = 24 * 60 * 60 * 1000;
  if (Date.now() - attendance.createdAt.getTime() > oneDayInMs) {
    throw buildError("Attendance records cannot be modified after 24 hours", 403);
  }

  return await Attendance.findByIdAndUpdate(id, data, { returnDocument: 'after' });
};

export const getAttendanceBySession = async (sessionId) => {
  return await Attendance.find({ sessionId })
    .populate("userId", "name email")
    .populate("markedBy", "name role");
};

export const getUserAttendance = async (userId) => {
  return await Attendance.find({ userId })
    .populate("sessionId", "title startTime")
    .populate("bootcampId", "name");
};