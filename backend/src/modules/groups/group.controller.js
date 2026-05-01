import * as groupService from "./group.service.js";

export const createGroupController = async (req, res, next) => {
  try {
    const group = await groupService.createGroup(
      req.body,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "Group created",
      data: group,
    });
  } catch (err) {
    next(err);
  }
};

export const getGroupsByBootcampController = async (req, res, next) => {
  try {
    const data = await groupService.getGroupsByBootcamp(
      req.params.bootcampId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const addMemberController = async (req, res, next) => {
  try {
    const data = await groupService.addMember(
      req.params.groupId,
      req.body.userId,
      req.body.bootcampId
    );

    res.status(200).json({
      success: true,
      message: "Member added",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const removeMemberController = async (req, res, next) => {
  try {
    const data = await groupService.removeMember(
      req.params.groupId,
      req.params.userId
    );

    res.status(200).json({
      success: true,
      message: "Member removed",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteGroupController = async (req, res, next) => {
  try {
    const result = await groupService.deleteGroup(req.params.groupId);

    res.status(200).json({
      success: true,
      message: "Group deleted",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const submitProgress = async (req, res, next) => {
  try {
    const studentId = req.user.userId;
    const result = await groupService.submitGroupProgress(req.body, studentId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getGroupProgressLogs = async (req, res, next) => {
  try {
    const result = await groupService.getGroupProgress(req.params.groupId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};