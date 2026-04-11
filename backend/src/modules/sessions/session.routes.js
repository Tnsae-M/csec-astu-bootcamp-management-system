import express from 'express';
import * as sessionController from './session.controller.js';

const router = express.Router();

// Later, we will add middleware here. Example:
// .post(verifyToken, verifyInstructorOrAdmin, sessionController.createSession)

router
  .route('/')
  .post(sessionController.createSession)    // POST /api/sessions
  .get(sessionController.getAllSessions);   // GET /api/sessions

router
  .route('/:id')
  .get(sessionController.getSessionById)    // GET /api/sessions/:id
  .put(sessionController.updateSession);    // PUT /api/sessions/:id

export default router;
