import { Task } from "./tasks.model.js";
const buildError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createTask = async (sessionId, payload) => {
  const { title, description, deadline } = payload;
  if (!title || !deadline) {
    throw buildError("Title and deadline are required", 400);
  }
  const task = await Task.create({
    title,
    description,
    deadline,
    sessionId,
  });
  return task;
};

export const getTaskBySession = async (sessionId) => {
  const tasks = await Task.find({ sessionId }).sort({ createdAt: -1 });
  return tasks;
};
export const updateTask = async (taskId, payload) => {
  const task = await Task.findByIdAndUpdate(taskId, payload, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    throw buildError("Task not found", 404);
  }
  return task;
};
export const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw buildError("Task not found", 404);
  }
  return true;
};
