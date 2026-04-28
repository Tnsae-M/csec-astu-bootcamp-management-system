import Bootcamp from "./bootcamp.model.js";
import Division from "../divisions/division.model.js";
const buildError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createBootcamp = async (
  divisionId,
  payload,
  startDate,
  endDate,
  createdBy,
) => {
  const division = await Division.findById(divisionId);
  if (!division) {
    throw buildError("Division not found.", 404);
  }
  const bootcamp = await Bootcamp.create({
    ...payload,
    divisionId,
    startDate,
    endDate,
    createdBy,
  });
  return bootcamp;
};
export const getBootcampsByDivision = async (divisionId) => {
  const division = await Division.findById(divisionId);
  if (!division) {
    throw buildError("Division not found.", 404);
  }
  const bootcamps = await Bootcamp.find({ divisionId }).populate(
    "instructors",
    "name email",
  );
  return bootcamps;
};
export const getBootcampById = async (bootcampId) => {
  const bootcamp = await Bootcamp.findById(bootcampId)
    .populate("divisionId", "name")
    .populate("instructors", "name email");
  if (!bootcamp) {
    throw buildError("Bootcamp not found.", 404);
  }
  return bootcamp;
};
export const updateBootcamp = async (id, payload) => {
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    throw buildError("Bootcamp not found", 404);
  }
  Object.assign(bootcamp, payload);
  await bootcamp.save();
  return bootcamp;
};
export const updateBootcampStatus = async (id, status) => {
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    throw buildError("Bootcamp not found.", 404);
  }
  if (!["upcoming", "active", "completed"].includes(status)) {
    throw buildError("Invalid status.", 400);
  }
  bootcamp.status = status;
  await bootcamp.save();
  return bootcamp;
};

export const deleteBootcamp = async (id) => {
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    throw buildError("Bootcamp not found.", 404);
  }
  await Bootcamp.findByIdAndDelete(id);
  return { id };
};
