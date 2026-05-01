import Attendance from "./attendance.model.js";

export const markAttendance = async (data) => {
  // Use upsert so updating an existing record doesn't create a duplicate
  return await Attendance.findOneAndUpdate(
    { userId: data.userId, sessionId: data.sessionId },
    { $set: data },
    { upsert: true, new: true, runValidators: true }
  ).populate("userId", "name email").populate("markedBy", "name role");
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