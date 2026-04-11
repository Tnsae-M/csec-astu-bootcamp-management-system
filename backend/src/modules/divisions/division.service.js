import Division from './division.model.js';
// Note: Later, when we build the Session, User, and Feedback models, 
// we will import them here to calculate live statistics.

export const createDivision = async (divisionData) => {
  // Prevent duplicate division names WITHIN the same bootcamp
  const existingDivision = await Division.findOne({ name: divisionData.name, bootcamp: divisionData.bootcamp });
  if (existingDivision) {
    const error = new Error('A division with this name already exists in this bootcamp');
    error.statusCode = 409; // Conflict
    throw error;
  }
  
  const division = new Division(divisionData);
  return await division.save();
};

export const getAllDivisions = async () => {
  // FUTURE GOAL: This is where we will write a MongoDB Aggregation Pipeline 
  // to calculate total students, sessions, etc., once those models exist!
  return await Division.find();
};

export const getDivisionById = async (divisionId) => {
  const division = await Division.findById(divisionId);
  
  if (!division) {
    const error = new Error('Division not found');
    error.statusCode = 404;
    throw error;
  }
  
  return division;
};

export const updateDivision = async (divisionId, updateData) => {
  const division = await Division.findByIdAndUpdate(divisionId, updateData, {
    new: true,
    runValidators: true
  });
  
  if (!division) {
    const error = new Error('Division not found');
    error.statusCode = 404;
    throw error;
  }
  
  return division;
};
