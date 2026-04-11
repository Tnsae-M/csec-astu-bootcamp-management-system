import express from 'express';
import * as divisionController from './division.controller.js';

const router = express.Router();

// Same here: In the future, we will add Admin-only middleware to the POST and PUT routes

router
  .route('/')
  .post(divisionController.createDivision)    // POST /api/divisions
  .get(divisionController.getAllDivisions);   // GET /api/divisions

router
  .route('/:id')
  .get(divisionController.getDivisionById)    // GET /api/divisions/:id
  .put(divisionController.updateDivision);    // PUT /api/divisions/:id

export default router;
