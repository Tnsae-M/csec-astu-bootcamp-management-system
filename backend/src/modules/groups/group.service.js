import Group from "./group.model.js";
import Enrollment from "../enrollments/enrollment.model.js";

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