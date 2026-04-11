import express from 'express';
import * as groupController from './group.controller.js';

const router = express.Router();

// Maps to POST /api/groups
router.post('/', groupController.createGroup);

// Maps to GET /api/groups
router.get('/', groupController.getAllGroups);

// Maps to GET /api/groups/division/:divisionId
router.get('/division/:divisionId', groupController.getDivisionGroups);

// Maps to GET /api/groups/:id
router.get('/:id', groupController.getGroupById);

// Specific action routes for clean API design
// Maps to PUT /api/groups/:id/add-student
router.put('/:id/add-student', groupController.addStudent);

// Maps to PUT /api/groups/:id/remove-student
router.put('/:id/remove-student', groupController.removeStudent);

export default router;
