import * as attendanceService from "./attendance.service.js";

export const markAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.markAttendance({
      ...req.body,
      markedBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked",
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
};

export const getSessionAttendance = async (req, res, next) => {
  try {
    const data = await attendanceService.getAttendanceBySession(
      req.params.sessionId
    );

    // If student (and not instructor/admin), only return their own record
    const userRoles = (req.user.roles || []).map(r => String(r || "").toUpperCase());
    const isPrivileged = userRoles.includes('ADMIN') || userRoles.includes('SUPER ADMIN') || userRoles.includes('INSTRUCTOR');

    if (!isPrivileged && userRoles.includes('STUDENT')) {
      const filteredData = data.filter(r => (r.userId?._id || r.userId).toString() === req.user.userId);
      return res.status(200).json({
        success: true,
        data: filteredData,
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const data = await attendanceService.getUserAttendance(req.user.userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};