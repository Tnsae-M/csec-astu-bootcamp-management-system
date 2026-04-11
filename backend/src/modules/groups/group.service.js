import Group from './group.model.js';
import Enrollment from '../enrollments/enrollment.model.js';

/**
 * Private Helper to enforce strict SRS rules on Group Members
 */
const validateGroupMembers = async (divisionId, memberIds, excludeGroupId = null) => {
  for (const studentId of memberIds) {
    // RULE 1: Must be actively enrolled in the division first! (The Ripple Effect)
    const isEnrolled = await Enrollment.findOne({ student: studentId, division: divisionId, status: 'Active' });
    if (!isEnrolled) {
      const error = new Error(`Student ID ${studentId} is not actively enrolled in this division.`);
      error.statusCode = 403; // Forbidden
      throw error;
    }

    // RULE 2: "One group per division per student"
    const existingGroupQuery = {
      division: divisionId,
      members: studentId,
      status: 'Active'
    };

    if (excludeGroupId) {
      existingGroupQuery._id = { $ne: excludeGroupId };
    }

    const existingGroup = await Group.findOne(existingGroupQuery);
    
    if (existingGroup) {
      const error = new Error(`Student ID ${studentId} is already assigned to the active group: ${existingGroup.name}`);
      error.statusCode = 409; // Conflict
      throw error;
    }
  }
};

export const createGroup = async (groupData) => {
  const { name, division, members = [] } = groupData;

  // RULE 3: "Group size: 2 - 8 students"
  if (members.length > 8) {
    const error = new Error('A group cannot exceed 8 students');
    error.statusCode = 422;
    throw error;
  }

  // Validate the members before saving
  if (members.length > 0) {
    await validateGroupMembers(division, members);
  }

  const group = new Group(groupData);
  return await group.save();
};

export const addStudentToGroup = async (groupId, studentId) => {
  const group = await Group.findById(groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.statusCode = 404;
    throw error;
  }

  if (group.members.length >= 8) {
    const error = new Error('This group is completely full (max 8 students)');
    error.statusCode = 422;
    throw error;
  }

  // Must cast to string for the helper validation
  await validateGroupMembers(group.division.toString(), [studentId], groupId);

  group.members.push(studentId);
  return await group.save();
};

export const removeStudentFromGroup = async (groupId, studentId) => {
  const group = await Group.findById(groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.statusCode = 404;
    throw error;
  }

  // Filter out the student
  group.members = group.members.filter(id => id.toString() !== studentId.toString());
  return await group.save();
};

export const getDivisionGroups = async (divisionId) => {
  return await Group.find({ division: divisionId })
    .populate('members', 'name email status');
};

export const getGroupById = async (groupId) => {
  return await Group.findById(groupId)
    .populate('division', 'name')
    .populate('members', 'name email status');
};

export const getAllGroups = async () => {
  return await Group.find()
    .populate('division', 'name')
    .populate('members', 'name email');
};
