import ResourceModel from "./resource.model.js";

// CREATE RESOURCE
export const createResource = async (req, res) => {
  try {
    const { title, type, url, session } = req.body;

    const resource = await ResourceModel.create({
      title,
      type,
      url,
      session,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Resource uploaded",
      data: resource,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL RESOURCES
export const getResources = async (req, res) => {
  try {
    const resources = await ResourceModel.find()
      .populate("session", "title")
      .populate("uploadedBy", "fullName");

    res.json({
      success: true,
      data: resources,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET BY SESSION
export const getResourcesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const resources = await ResourceModel.find({ session: sessionId });

    res.json({
      success: true,
      data: resources,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE RESOURCE
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    await ResourceModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Resource deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// INCREMENT DOWNLOAD
export const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await ResourceModel.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      data: resource,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};