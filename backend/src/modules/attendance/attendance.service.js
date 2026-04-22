import Attendance from "./attendance.model.js";

export const markAttendance = async (data) => {
  return await Attendance.create(data);
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