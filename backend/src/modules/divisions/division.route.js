import express from "express";
import * as divisionController from "./division.controller.js";
import {
  validateCreateDivision,
  validateUpdateDivision,
} from "./division.validator.js";
import * as bootcampController from "../bootcamps/bootcamp.controller.js";
import { authGuard, roleGuard } from "../../middleware/role.guard.js";

const router = express.Router();

router.post("/", roleGuard("admin"), divisionController.createDivision);
router.get("/", authGuard, divisionController.getDivisions);
router.get("/:id", authGuard, divisionController.getDivisionById);
router.put(
  "/:id",
  roleGuard("admin"),
  validateUpdateDivision,
  divisionController.updateDivision,
);
router.delete("/:id", roleGuard("admin"), divisionController.deleteDivision);
router.get(
  "/:divisionId/bootcamps",
  authGuard,
  bootcampController.getBootcampsByDivision,
);
router.post(
  "/:divisionId/bootcamps",
  authGuard,
  roleGuard("admin"),
  bootcampController.createBootcamp,
);
export default router;
