


import * as sessionService from "./session.service.js";

export const createSession = async (req, res, next) => {
  try {
    const session = await sessionService.createSession(req.body, req.user?.userId);

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getSessions();

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err) {
    next(err);
  }
};

export const getSessionsByBootcamp = async (req, res, next) => {
  try {
    const sessions = await sessionService.getSessionsByBootcamp(
      req.params.bootcampId
    );

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const session = await sessionService.updateSession(
      req.params.id,
      req.body,
      req.user?.userId
    );

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    await sessionService.deleteSession(req.params.id);

    res.status(200).json({
      success: true,
      message: "Session deleted",
    });
  } catch (err) {
    next(err);
  }
};