import express from 'express';
import * as userController from './user.controller.js';

const router = express.Router();

// We will add authentication and authorization middleware here later
// to ensure only Admins can create or update users.

router
  .route('/')
  .post(userController.createUser)    // POST /api/users
  .get(userController.getAllUsers);   // GET /api/users

router
  .route('/:id')
  .get(userController.getUserById)    // GET /api/users/:id
  .put(userController.updateUser);    // PUT /api/users/:id

export default router;
