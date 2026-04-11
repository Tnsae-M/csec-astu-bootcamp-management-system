import Task from './task.model.js';

export const createTask = async (taskData) => {
  if (!taskData || typeof taskData !== 'object') {
    const error = new Error('Task data is required');
    error.statusCode = 400;
    throw error;
  }

  if (!taskData.deadline) {
    const error = new Error('Task deadline is required');
    error.statusCode = 400;
    throw error;
  }

  const deadline = new Date(taskData.deadline);
  if (isNaN(deadline.getTime())) {
    const error = new Error('Task deadline must be a valid date');
    error.statusCode = 400;
    throw error;
  }

  // Rule: You cannot create an assignment with a deadline in the past
  if (deadline <= new Date()) {
    const error = new Error('The deadline must be set in the future');
    error.statusCode = 400; // Validation Error
    throw error;
  }

  const task = new Task(taskData);
  return await task.save();
};

export const getTasks = async (filters = {}) => {
  // We sort by deadline (ascending: 1) so the most urgent tasks appear at the top
  return await Task.find(filters)
    .populate('division', 'name')
    .populate('createdBy', 'name email')
    .sort({ deadline: 1 });
};

export const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate('division', 'name')
    .populate('createdBy', 'name email');
    
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  
  return task;
};

export const updateTask = async (taskId, updateData) => {
  // If the instructor is extending or shortening the deadline, validate it
  if (updateData.deadline && new Date(updateData.deadline) <= new Date()) {
    const error = new Error('The new deadline must be set in the future');
    error.statusCode = 400;
    throw error;
  }

  const task = await Task.findByIdAndUpdate(taskId, updateData, { 
    new: true, 
    runValidators: true 
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Note: SRS says "Task deadlines -> Reminders". 
  // If the deadline changes, we'd trigger the Notification System here to warn students.
  
  return task;
};

// Admins/Instructors might need to delete a task made by mistake
export const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  
  return task;
};
