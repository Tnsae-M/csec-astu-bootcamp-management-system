import * as taskService from "./task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Task created",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const getTasksByBootcamp = async (req, res, next) => {
  try {
    const data = await taskService.getTasksByBootcamp(
      req.params.bootcampId,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const data = await taskService.getTaskById(
      req.params.id,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Task updated",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};