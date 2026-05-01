import Session from "./session.model.js";



import Bootcamp from "../bootcamps/bootcamp.model.js";

export const createSession = async (data) => {
  const { bootcamp, date, startTime, durationH, ...rest } = data;

  const foundBootcamp = await Bootcamp.findById(bootcamp);
  if (!foundBootcamp) {
    throw new Error("Bootcamp not found");
  }

  // Parse startTime and calculate endTime
  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + (durationH || 1) * 60 * 60 * 1000);

  const overlap = await Session.findOne({
    bootcamp,
    $and: [
      { startTime: { $lt: endDateTime } },
      { endTime: { $gt: startDateTime } }
    ]
  });

  if (overlap) {
    const error = new Error("This time slot overlaps with an existing session in this bootcamp.");
    error.status = 409;
    throw error;
  }

  const session = await Session.create({
    ...rest,
    bootcamp,
    startTime: startDateTime,
    endTime: endDateTime,
  });

  return session;
};


export const getSessions = async () => {
  return await Session.find()
    .populate("bootcamp")
    .populate("instructor");
};

export const getSessionsByBootcamp = async (bootcampId) => {
  return await Session.find({ bootcamp: bootcampId });
};

export const updateSession = async (id, data) => {
  const { date, startTime, durationH, ...rest } = data;

  let updateData = { ...rest };

  if (date && startTime) {
    const startDateTime = new Date(`${date}T${startTime}:00`);
    updateData.startTime = startDateTime;

    if (durationH) {
      updateData.endTime = new Date(startDateTime.getTime() + durationH * 60 * 60 * 1000);
    }
    
    // We need to check for overlaps excluding the current session
    const existingSession = await Session.findById(id);
    const bootcampId = existingSession.bootcamp;
    const endDateTime = updateData.endTime || existingSession.endTime;
    
    const overlap = await Session.findOne({
      _id: { $ne: id },
      bootcamp: bootcampId,
      $and: [
        { startTime: { $lt: endDateTime } },
        { endTime: { $gt: startDateTime } }
      ]
    });

    if (overlap) {
      const error = new Error("This time slot overlaps with an existing session in this bootcamp.");
      error.status = 409;
      throw error;
    }
  }

  return await Session.findByIdAndUpdate(id, updateData, { new: true });
};


export const deleteSession = async (id) => {
  return await Session.findByIdAndDelete(id);
};