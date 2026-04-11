import Bootcamp from './bootcamp.model.js';

export const createBootcamp = async (bootcampData) => {
  // Prevent exact duplicate names
  const existing = await Bootcamp.findOne({ name: bootcampData.name });
  if (existing) {
    const error = new Error('A bootcamp with this exact name already exists');
    error.statusCode = 409;
    throw error;
  }
  const bootcamp = new Bootcamp(bootcampData);
  return await bootcamp.save();
};

export const getBootcamps = async (filters = {}) => {
  // Sort them so the newest/most recent bootcamps are always at the top
  return await Bootcamp.find(filters).sort({ startDate: -1 });
};

export const getBootcampById = async (bootcampId) => {
  const bootcamp = await Bootcamp.findById(bootcampId);
  if (!bootcamp) {
    const error = new Error('Bootcamp not found');
    error.statusCode = 404;
    throw error;
  }
  return bootcamp;
};

export const updateBootcamp = async (bootcampId, updateData) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(bootcampId, updateData, {
    new: true,
    runValidators: true // This will forcibly re-run the startDate < endDate check!
  });
  if (!bootcamp) {
    const error = new Error('Bootcamp not found');
    error.statusCode = 404;
    throw error;
  }
  return bootcamp;
};

export const deleteBootcamp = async (bootcampId) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(bootcampId);
  if (!bootcamp) {
    const error = new Error('Bootcamp not found');
    error.statusCode = 404;
    throw error;
  }
  return bootcamp;
};
