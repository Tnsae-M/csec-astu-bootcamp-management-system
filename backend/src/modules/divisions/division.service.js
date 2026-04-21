import Division from "./division.model.js";

const buildError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createDivision = async (payload) => {
  const existingDivision = await Division.findOne({ name: payload.name });

  if (existingDivision) {
    throw buildError("Division name already exists.", 409);
  }
  return await Division.create(payload);
};
//here there will be no filters for now since we have only 6 divisions, but in future if we want to add filters like name or createdAt we can easily add them here.
export const getDivisions = async (name) => {
  const filters = {};
  if (name) {
    filters.name = { $regex: name, $options: "i" };
  }
  const items = await Division.find(filters);
  return items;
  
};

export const getDivisionById = async (divisionId) => {
  const division = await Division.findById(divisionId);
  if (!division) {
    throw buildError("Division not found.", 404);
  }
  return division;
};

export const updateDivision = async (divisionId, payload) => {
  const existingDivision = await Division.findById(divisionId);
  if (!existingDivision) {
    throw buildError("Division not found.", 404);
  }

  if (payload.name) {
    const duplicate = await Division.findOne({
      _id: { $ne: divisionId },
      name: payload.name,
    });

    if (duplicate) {
      throw buildError("Another division already uses this name.", 409);
    }
  }

  Object.assign(existingDivision, payload);
  await existingDivision.save();

  return existingDivision;
};

export const deleteDivision = async (divisionId) => {
  const division = await Division.findById(divisionId);
  if (!division) {
    throw buildError("Division not found.", 404);
  }

  await Division.findByIdAndDelete(divisionId);
  return { id: divisionId };
};
