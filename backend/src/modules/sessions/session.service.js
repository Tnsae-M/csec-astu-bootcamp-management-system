import Session from "./session.model.js";



import Bootcamp from "../bootcamps/bootcamp.model.js";

export const createSession = async (data) => {
  const bootcamp = await Bootcamp.findById(data.bootcamp);

  if (!bootcamp) {
    throw new Error("Bootcamp not found");
  }

  const session = await Session.create(data);
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
  return await Session.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSession = async (id) => {
  return await Session.findByIdAndDelete(id);
};