import express from 'express';
import * as taskController from './task.controller.js';

const router = express.Router();

// Maps to POST /api/tasks
// Maps to GET /api/tasks
router
  .route('/')
  .post(taskController.createTask)
  .get(taskController.getTasks);

// Maps to GET /api/tasks/:id
// Maps to PUT /api/tasks/:id
// Maps to DELETE /api/tasks/:id
router
  .route('/:id')
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;
