import express from 'express';
import * as resourceController from './resource.controller.js';

const router = express.Router();

// Maps to POST /api/resources
router.post('/', resourceController.createResource);

// Maps to GET /api/resources
router.get('/', resourceController.getAllResources);

// Maps to GET /api/resources/division/:divisionId
router.get('/division/:divisionId', resourceController.getDivisionResources);

// Special Action Route: Tracking clicks/downloads 
// Maps to PUT /api/resources/:id/download
router.put('/:id/download', resourceController.trackDownload);

// Maps to DELETE /api/resources/:id
router.delete('/:id', resourceController.deleteResource);

export default router;
