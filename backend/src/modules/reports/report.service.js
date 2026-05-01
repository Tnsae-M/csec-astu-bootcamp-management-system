import Report from './report.model.js';
import Attendance from '../attendance/attendance.model.js';
import Submission from '../submissions/submission.model.js';
import Task from '../tasks/task.model.js';
import User from '../users/user.model.js';

export const createReport = async (data) => {
  const report = new Report(data);
  return report.save();
};

export const getReports = async (filter = {}, options = {}) => {
  return Report.find(filter)
    .sort({ createdAt: -1 })
    .limit(options.limit || 0)
    .skip(options.skip || 0)
    .lean();
};

export const getReportById = async (id) => {
  return Report.findById(id).lean();
};

export const updateReport = async (id, data) => {
  return Report.findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean();
};

export const deleteReport = async (id) => {
  return Report.findByIdAndDelete(id);
};

import os from 'os';

export const getGlobalAnalytics = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const recentAttendanceCount = await Attendance.countDocuments({
    createdAt: { $gte: oneWeekAgo }
  });

  const totalTasks = await Task.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalSubmissions = await Submission.countDocuments();

  let submissionRate = 0;
  if (totalTasks > 0 && totalStudents > 0) {
    submissionRate = Math.min(Math.round((totalSubmissions / (totalTasks * totalStudents)) * 100), 100);
  } else if (totalSubmissions > 0) {
    submissionRate = 100;
  }

  // SYSTEM DIAGNOSTICS
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const memUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);
  const loadAvg = os.loadavg()[0].toFixed(2);
  const sysUptime = Math.floor(os.uptime() / 3600); // in hours

  return {
    attendance: recentAttendanceCount,
    submissionsRate: submissionRate,
    uptime: `${sysUptime}h`,
    cpuLoad: `${loadAvg}%`,
    memoryUsage: `${memUsage}%`,
    platform: os.platform(),
    totalMemory: `${(totalMem / (1024 * 1024 * 1024)).toFixed(2)} GB`
  };
};
