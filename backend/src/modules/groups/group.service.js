import Group from "./group.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import GroupProgress from "./progress.model.js";
import Bootcamp from "../bootcamps/bootcamp.model.js";

const buildError = (msg, code = 400) => {
  const err = new Error(msg);
  err.statusCode = code;
  return err;
};

//  Create group
export const createGroup = async (data, creatorId) => {
  const { bootcampId, members = [] } = data;

  //  Validate members are enrolled
  for (const userId of members) {
    const enrollment = await Enrollment.findOne({
      userId,
      bootcampId,
    });

    if (!enrollment) {
      throw buildError(`User ${userId} is not enrolled`, 400);
    }
  }

  return await Group.create({
    ...data,
    createdBy: creatorId,
  });
};

//  Get groups by bootcamp
export const getGroupsByBootcamp = async (bootcampId) => {
  return await Group.find({ bootcampId })
    .populate("members", "name email")
    .populate("mentor", "name email")
    .populate("createdBy", "name");
};


//  Add member
export const addMember = async (groupId, userId, bootcampId) => {
  const group = await Group.findById(groupId);
  if (!group) throw buildError("Group not found", 404);

  const enrollment = await Enrollment.findOne({
    userId,
    bootcampId,
  });

  if (!enrollment) {
    throw buildError("User not enrolled in this bootcamp", 400);
  }

  if (group.members.includes(userId)) {
    throw buildError("User already in group", 409);
  }

  group.members.push(userId);
  await group.save();

  return group;
};

//  Remove member
export const removeMember = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw buildError("Group not found", 404);

  group.members = group.members.filter(
    (id) => id.toString() !== userId
  );

  await group.save();
  return group;
};

// Delete group
export const deleteGroup = async (groupId) => {
  const group = await Group.findById(groupId);
  if (!group) throw buildError("Group not found", 404);

  await Group.findByIdAndDelete(groupId);
  return { id: groupId };
};

// --- Weekly Progress ---

export const submitGroupProgress = async (data, studentId) => {
  const { groupId, bootcampId, title, description, links } = data;

  // 1. Verify Group & Membership
  const group = await Group.findById(groupId);
  if (!group) throw buildError("Group not found", 404);
  if (!group.members.includes(studentId)) {
    throw buildError("Only group members can submit progress", 403);
  }

  // 2. Calculate Week Number
  const bootcamp = await Bootcamp.findById(bootcampId);
  if (!bootcamp) throw buildError("Bootcamp not found", 404);
  
  const startDate = bootcamp.startDate || bootcamp.createdAt;
  const now = new Date();
  const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.max(1, Math.ceil((diffDays + 1) / 7));

  // 3. Create Progress (Unique constraint in model handles 1 per week)
  try {
    return await GroupProgress.create({
      groupId,
      bootcampId,
      submittedBy: studentId,
      weekNumber,
      title,
      description,
      links
    });
  } catch (err) {
    if (err.code === 11000) {
      throw buildError(`Progress for Week ${weekNumber} has already been submitted for this group`, 409);
    }
    throw err;
  }
};

export const getGroupProgress = async (groupId) => {
  return await GroupProgress.find({ groupId })
    .populate("submittedBy", "name")
    .sort({ weekNumber: -1 });
};