import Resource from './resource.model.js';

export const createResource = async (resourceData) => {
  const resource = new Resource(resourceData);
  return await resource.save();
};

export const getDivisionResources = async (divisionId) => {
  // Pulls all resources for a specific division, newest first
  return await Resource.find({ division: divisionId })
    .populate('uploadedBy', 'name role')
    .populate('session', 'title') 
    .sort({ createdAt: -1 });
};

/**
 * Handle the "Track downloads" rule securely exactly as the DB requires
 */
export const trackDownload = async (resourceId) => {
  // We use MongoDB's incredibly fast `$inc` operater to add exactly 1 to the download count dynamically
  const resource = await Resource.findByIdAndUpdate(
    resourceId,
    { $inc: { downloads: 1 } },
    { new: true }
  );

  if (!resource) {
    const error = new Error('Resource not found');
    error.statusCode = 404;
    throw error;
  }
  
  return resource;
};

export const deleteResource = async (resourceId) => {
  const resource = await Resource.findByIdAndDelete(resourceId);
  if (!resource) {
    const error = new Error('Resource not found');
    error.statusCode = 404;
    throw error;
  }
  return resource;
};

export const getAllResources = async () => {
  return await Resource.find()
    .populate('division', 'name')
    .populate('uploadedBy', 'name role')
    .sort({ createdAt: -1 });
};
