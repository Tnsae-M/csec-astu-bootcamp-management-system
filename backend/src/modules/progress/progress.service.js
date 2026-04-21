import Enrollment from "../enrollments/enrollment.model.js";
import Attendance from "../attendance/attendance.model.js";
import Task from "../tasks/task.model.js";
import Submission from "../submissions/submission.model.js";
import Session from "../sessions/session.model.js";


const buildError = (msg, code = 400) => {
  const err = new Error(msg);
  err.statusCode = code;
  return err;
};

export const getMyProgress = async (userId, bootcampId) => {
  // Check enrollment
  const enrollment = await Enrollment.findOne({ userId, bootcampId });
  if (!enrollment) {
    throw buildError("Not enrolled in this bootcamp", 403);
  }

  // ATTENDANCE
  // =========================
//   const totalSessions = await Attendance.countDocuments({ bootcampId });

const totalSessions = await Session.countDocuments({
  bootcamp: bootcampId,
});

  const attendedSessions = await Attendance.countDocuments({
    bootcampId,
    userId,
    status: "present",
  });

  const attendanceRate =
    totalSessions === 0 ? 0 : (attendedSessions / totalSessions) * 100;

  //  TASKS
  // =========================
  const totalTasks = await Task.countDocuments({ bootcampId });

  const submissions = await Submission.find({ studentId: userId })
    .populate("taskId");

  const submittedTasks = submissions.filter(
    (s) => s.taskId.bootcampId.toString() === bootcampId.toString()
  );

  const taskCompletionRate =
    totalTasks === 0 ? 0 : (submittedTasks.length / totalTasks) * 100;

  // =========================
  //  SCORES
  // =========================
  const graded = submittedTasks.filter((s) => s.score !== null);

  const totalScore = graded.reduce((acc, s) => acc + s.score, 0);

  const avgScore =
    graded.length === 0 ? 0 : totalScore / graded.length;

  // FINAL PROGRESS SCORE
  // =========================
  const overallProgress =
    attendanceRate * 0.3 +
    taskCompletionRate * 0.4 +
    avgScore * 0.3;

  return {
    attendanceRate: Math.round(attendanceRate),
    taskCompletionRate: Math.round(taskCompletionRate),
    avgScore: Math.round(avgScore),
    overallProgress: Math.round(overallProgress),
  };
};