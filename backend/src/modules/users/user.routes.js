import express from 'express';
import * as userController from './user.controller.js';
import { authGuard, roleGuard } from "../../middleware/role.guard.js";


const router = express.Router();





router
  .route('/')
  // Allow both admin and super admin to create users
  .post(authGuard, roleGuard(['admin', 'super admin']), userController.createUser)
  .get(authGuard, userController.getAllUsers);

router
  .route('/:id')
  .get(authGuard, userController.getUserById)
  // Allow both admin and super admin to update users
  .put(authGuard, roleGuard(['admin', 'super admin']), userController.updateUser);


  export default router;


// We will add authentication and authorization middleware here later
// to ensure only Admins can create or update users.

// router
//   .route('/')
//   .post(userController.createUser)    // POST /api/users
//   .get(userController.getAllUsers);   // GET /api/users

// router
//   .route('/:id')
//   .get(userController.getUserById)    // GET /api/users/:id
//   .put(userController.updateUser)// PUT /api/users/:id

