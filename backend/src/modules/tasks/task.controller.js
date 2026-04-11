import * as taskService from './task.service.js';

/**
 * @desc    Create a new task/assignment
 * @route   POST /api/tasks
 * @access  Private (Instructor)
 */
export const createTask = async (req, res, next) => {
  try {
    // In a real app with Auth, req.body.createdBy = req.user.id
    const task = await taskService.createTask(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tasks (optionally filtered by division)
 * @route   GET /api/tasks
 * @access  Private (All Users)
 */
export const getTasks = async (req, res, next) => {
  try {
    const filters = {};
    // Students only want to see tasks assigned to their division!
    if (req.query.division) {
      filters.division = req.query.division;
    }

    const tasks = await taskService.getTasks(filters);
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private (All Users)
 */
export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task (extend deadline, change score, etc)
 * @route   PUT /api/tasks/:id
 * @access  Private (Instructor / Admin)
 */
export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task entirely
 * @route   DELETE /api/tasks/:id
 * @access  Private (Instructor / Admin)
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
