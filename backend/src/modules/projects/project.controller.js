import Project from "./project.model.js";

export const getProjectsByBootcamp = async (req, res) => {
  try {
    const { bootcampId } = req.params;
    const projects = await Project.find({ bootcampId }).populate("createdBy", "name email");
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, url, bootcampId } = req.body;
    
    if (!title || !bootcampId) {
      return res.status(400).json({ success: false, message: "Title and Bootcamp ID are required" });
    }

    const project = await Project.create({
      title,
      description,
      url,
      bootcampId,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
