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
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (due < now) {
    throw buildError("Due date cannot be in the past");
  }

  return await Task.create({
    ...data,
    createdBy: user.userId,
  });
};

//  Get tasks for bootcamp (ONLY if enrolled)
export const getTasksByBootcamp = async (bootcampId, userId, roles = []) => {
  const userRoles = Array.isArray(roles) ? roles : [roles];
  const isFaculty = userRoles.some(r => 
    ["admin", "super admin", "instructor"].includes((r || "").toLowerCase())
  );

  if (!isFaculty) {
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
export const getTaskById = async (taskId, userId, roles = []) => {
  const task = await Task.findById(taskId)
    .populate("bootcampId", "name")
    .populate("sessionId", "title");

  if (!task) throw buildError("Task not found", 404);

  const userRoles = Array.isArray(roles) ? roles : [roles];
  const isFaculty = userRoles.some(r => 
    ["admin", "super admin", "instructor"].includes((r || "").toLowerCase())
  );

  if (!isFaculty) {
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

//  Get all tasks relevant to the user
export const getAllTasks = async (userId, roles = []) => {
  const userRoles = (Array.isArray(roles) ? roles : [roles]).map(r => String(r).toLowerCase());
  const isSuperAdmin = userRoles.includes('super admin');
  const isAdmin = userRoles.includes('admin');
  const isInstructor = userRoles.includes('instructor');

  if (isSuperAdmin || isAdmin) {
    return await Task.find({})
      .populate("bootcampId", "name")
      .populate("sessionId", "title")
      .sort({ createdAt: -1 });
  }

  if (isInstructor) {
    return await Task.find({ createdBy: userId })
      .populate("bootcampId", "name")
      .populate("sessionId", "title")
      .sort({ createdAt: -1 });
  }

  // For students, find tasks in all enrolled bootcamps
  const enrollments = await Enrollment.find({ userId });
  const bootcampIds = enrollments.map(e => e.bootcampId);

  return await Task.find({ bootcampId: { $in: bootcampIds } })
    .populate("bootcampId", "name")
    .populate("sessionId", "title")
    .sort({ dueDate: 1 });
};