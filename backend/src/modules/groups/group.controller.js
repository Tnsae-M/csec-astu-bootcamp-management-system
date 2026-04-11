import * as groupService from './group.service.js';

/**
 * @desc    Create a new group
 * @route   POST /api/groups
 * @access  Private (Admin)
 */
export const createGroup = async (req, res, next) => {
  try {
    const group = await groupService.createGroup(req.body);
    res.status(201).json({ success: true, data: group });
  } catch (err) { 
    next(err); 
  }
};

/**
 * @desc    Add a student to an existing group
 * @route   PUT /api/groups/:id/add-student
 * @access  Private (Admin)
 */
export const addStudent = async (req, res, next) => {
  try {
    const group = await groupService.addStudentToGroup(req.params.id, req.body.studentId);
    res.status(200).json({ success: true, data: group });
  } catch (err) { 
    next(err); 
  }
};

/**
 * @desc    Remove a student from a group
 * @route   PUT /api/groups/:id/remove-student
 * @access  Private (Admin)
 */
export const removeStudent = async (req, res, next) => {
  try {
    const group = await groupService.removeStudentFromGroup(req.params.id, req.body.studentId);
    res.status(200).json({ success: true, data: group });
  } catch (err) { 
    next(err); 
  }
};

/**
 * @desc    Get all groups for a division
 * @route   GET /api/groups/division/:divisionId
 * @access  Private (Instructor / Admin)
 */
export const getDivisionGroups = async (req, res, next) => {
  try {
    const groups = await groupService.getDivisionGroups(req.params.divisionId);
    res.status(200).json({ success: true, count: groups.length, data: groups });
  } catch (err) { 
    next(err); 
  }
};

/**
 * @desc    Get a single group by ID
 * @route   GET /api/groups/:id
 * @access  Private (All Users)
 */
export const getGroupById = async (req, res, next) => {
  try {
    const group = await groupService.getGroupById(req.params.id);
    res.status(200).json({ success: true, data: group });
  } catch (err) { 
    next(err); 
  }
};

/**
 * @desc    Get all groups
 * @route   GET /api/groups
 * @access  Private (Admin)
 */
export const getAllGroups = async (req, res, next) => {
  try {
    const groups = await groupService.getAllGroups();
    res.status(200).json({ success: true, count: groups.length, data: groups });
  } catch (err) { 
    next(err); 
  }
};
