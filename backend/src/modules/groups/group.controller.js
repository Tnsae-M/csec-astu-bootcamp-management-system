import * as groupService from "./group.service.js";

export const createGroup = async (req, res, next) => {
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

export const getGroupsByBootcamp = async (req, res, next) => {
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

export const updateGroup = async (req, res, next) => {
  try {
    const data = await groupService.updateGroup(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Group updated",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const data = await groupService.addMember(
      req.params.id,
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

export const removeMember = async (req, res, next) => {
  try {
    const data = await groupService.removeMember(
      req.params.id,
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

export const deleteGroup = async (req, res, next) => {
  try {
    const result = await groupService.deleteGroup(req.params.id);

    res.status(200).json({
      success: true,
      message: "Group deleted",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};