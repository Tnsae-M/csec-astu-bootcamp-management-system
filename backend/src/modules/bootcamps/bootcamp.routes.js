import express from 'express';
import * as bootcampController from './bootcamp.controller.js';

const router = express.Router();

router.route('/')
  .post(bootcampController.createBootcamp)
  .get(bootcampController.getBootcamps);

router.route('/:id')
  .get(bootcampController.getBootcampById)
  .put(bootcampController.updateBootcamp)
  .delete(bootcampController.deleteBootcamp);

export default router;
