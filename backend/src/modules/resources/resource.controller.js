import Resource from "./resource.model.js";
import path from "path";
import fs from "fs";

export const getResourcesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const resources = await Resource.find({ session: sessionId }).populate("author", "name");
    
    // Add uploaderName fallback if populated author exists
    const formattedResources = resources.map(res => {
      const doc = res.toObject();
      if (doc.author && doc.author.name && !doc.uploaderName) {
        doc.uploaderName = doc.author.name;
      }
      return doc;
    });

    res.status(200).json({ success: true, data: formattedResources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadResource = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const resource = await Resource.create({
      title,
      description,
      filename: req.file.filename,
      session: sessionId,
      uploaderName: req.user.name,
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    const filePath = path.resolve("uploads", resource.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found on server" });
    }

    res.download(filePath, resource.filename);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
