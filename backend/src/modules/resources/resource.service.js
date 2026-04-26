import ResourceModel from "./resource.model.js";

export const createResourceService = (data) => {
  return ResourceModel.create(data);
};

export const getAllResourcesService = () => {
  return ResourceModel.find()
    .populate("session", "title")
    .populate("uploadedBy", "fullName");
};

export const getResourcesBySessionService = (sessionId) => {
  return ResourceModel.find({ session: sessionId });
};

export const deleteResourceService = (id) => {
  return ResourceModel.findByIdAndDelete(id);
};

export const incrementDownloadService = (id) => {
  return ResourceModel.findByIdAndUpdate(
    id,
    { $inc: { downloads: 1 } },
    { new: true }
  );
};