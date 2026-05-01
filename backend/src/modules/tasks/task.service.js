import Task from "./task.model.js";
import Bootcamp from "../bootcamps/bootcamp.model.js";
import Session from "../sessions/session.model.js";
import Enrollment from "../enrollments/enrollment.model.js";

const buildError = (msg, code = 400) => {
  const err = new Error(msg);
  err.statusCode = code;
  return err;
};

//  Create Task
export const createTask = async (data, user) => {
  const { bootcampId, sessionId, dueDate } = data;

  const bootcamp = await Bootcamp.findById(bootcampId);
  if (!bootcamp) throw buildError("Bootcamp not found", 404);

  // Optional session validation
  if (sessionId) {
    const session = await Session.findById(sessionId);
    if (!session) throw buildError("Session not found", 404);
  }

  // 🚨 Important rule
  if (new Date(dueDate) < new Date()) {
    throw buildError("Due date cannot be in the past");
  }

  return await Task.create({
    ...data,
    createdBy: user.userId,
  });
};

//  Get tasks for bootcamp (ONLY if enrolled)
export const getTasksByBootcamp = async (bootcampId, userId, reqUser) => {
  if (reqUser && (reqUser.role.includes('admin') || reqUser.role.includes('super admin') || reqUser.role.includes('instructor'))) {
    // Admins and instructors skip enrollment check
  } else {
    const enrollment = await Enrollment.findOne({
      userId,
      bootcampId,
    });

    if (!enrollment) {
      throw buildError("You are not enrolled in this bootcamp", 403);
    }
  }

  return await Task.find({ bootcampId })
    .populate("sessionId", "title startTime")
    .sort({ dueDate: 1 });
};

//  Get single task
export const getTaskById = async (taskId, userId, reqUser) => {
  const task = await Task.findById(taskId)
    .populate("bootcampId", "name")
    .populate("sessionId", "title");

  if (!task) throw buildError("Task not found", 404);

  if (reqUser && (reqUser.role.includes('admin') || reqUser.role.includes('super admin') || reqUser.role.includes('instructor'))) {
    // Access granted
  } else {
    const enrollment = await Enrollment.findOne({
      userId,
      bootcampId: task.bootcampId._id,
    });

    if (!enrollment) {
      throw buildError("Access denied", 403);
    }
  }

  return task;
};

//  Update task
export const updateTask = async (taskId, data) => {
  const task = await Task.findById(taskId);
  if (!task) throw buildError("Task not found", 404);

  Object.assign(task, data);
  await task.save();

  return task;
};

//  Delete task
export const deleteTask = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) throw buildError("Task not found", 404);

  await Task.findByIdAndDelete(taskId);
  return { id: taskId };
};