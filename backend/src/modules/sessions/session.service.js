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
  }

  return await Session.findByIdAndUpdate(id, updateData, { new: true });
};


export const deleteSession = async (id) => {
  return await Session.findByIdAndDelete(id);
};