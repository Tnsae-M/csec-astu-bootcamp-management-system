import * as resourceService from './resource.service.js';

/**
 * @desc    Upload a new resource
 * @route   POST /api/resources
 * @access  Private (Instructor / Admin)
 */
export const createResource = async (req, res, next) => {
  try {
    const resource = await resourceService.createResource(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) { 
    next(error); 
  }
};

/**
 * @desc    Get all resources for a specific division
 * @route   GET /api/resources/division/:divisionId
 * @access  Private (Student)
 */
export const getDivisionResources = async (req, res, next) => {
  try {
    const resources = await resourceService.getDivisionResources(req.params.divisionId);
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) { 
    next(error); 
  }
};

/**
 * @desc    Increment the download tracking counter
 * @route   PUT /api/resources/:id/download
 * @access  Private (Student)
 */
export const trackDownload = async (req, res, next) => {
  try {
    const resource = await resourceService.trackDownload(req.params.id);
    res.status(200).json({ success: true, message: 'Download tracked', count: resource.downloads });
  } catch (error) { 
    next(error); 
  }
};

/**
 * @desc    Delete a resource
 * @route   DELETE /api/resources/:id
 * @access  Private (Instructor / Admin)
 */
export const deleteResource = async (req, res, next) => {
  try {
    await resourceService.deleteResource(req.params.id);
    res.status(200).json({ success: true, message: 'Resource removed completely', data: {} });
  } catch (error) { 
    next(error); 
  }
};

/**
 * @desc    Get all resources
 * @route   GET /api/resources
 * @access  Private (Admin)
 */
export const getAllResources = async (req, res, next) => {
  try {
    const resources = await resourceService.getAllResources();
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) { 
    next(error); 
  }
};
