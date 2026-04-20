import * as taskService from "./tasks.service.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.params.sessionId, req.body);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};
export const getTasksBySession = async (req, res, next) => {
  try {
    const tasks = await taskService.getTaskBySession(req.params.sessionId);
    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (er) {
    next(er);
  }
};
export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (er) {
    next(er);
  }
};
export const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
