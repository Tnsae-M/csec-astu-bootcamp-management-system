import Resource from "./resource.model.js";
import fs from "fs";
import path from "path";

export const uploadResource = async (req, res, next) => {
  try {
    const { title, description, type, url, bootcampId, sessionId } = req.body;
    let fileUrl = "";

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const resource = await Resource.create({
      title,
      description,
      type: req.file ? "document" : type || "link",
      url,
      fileUrl,
      bootcampId,
      sessionId: sessionId || undefined,
      createdBy: req.user.userId,
    });

    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    next(err);
  }
};

export const getResources = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.bootcampId) filter.bootcampId = req.query.bootcampId;
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;

    const resources = await Resource.find(filter).populate("createdBy", "name email role").sort("-createdAt");
    res.status(200).json({ success: true, data: resources });
  } catch (err) {
    next(err);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      const err = new Error("Resource not found");
      err.status = 404;
      return next(err);
    }
    
    if (resource.fileUrl) {
      const filePath = path.join(process.cwd(), resource.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await resource.deleteOne();
    res.status(200).json({ success: true, message: "Resource deleted" });
  } catch (err) {
    next(err);
  }
};
