import * as bootcampService from "./bootcamp.service.js";

export const createBootcamp = async (req, res, next) => {
  try {
    const { divisionId } = req.params;
    const { name, startDate, endDate, ...payload } = req.body;
    const bootcamp = await bootcampService.createBootcamp(
      divisionId,
      { name, ...payload },
      startDate,
      endDate,
      req.user.userId,
    );
    return res.status(201).json({
      success: true,
      message: "Bootcamp created successfully",
      data: bootcamp,
    });
  } catch (error) {
    return next(error);
  }
};

export const getBootcampsByDivision = async (req, res, next) => {
  try {
    const bootcamps = await bootcampService.getBootcampsByDivision(
      req.params.divisionId,
    );
    return res.status(200).json({
      success: true,
      message: "Bootcamps retrieved successfully",
      data: bootcamps,
    });
  } catch (error) {
    return next(error);
  }
};

export const getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await bootcampService.getBootcampById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Bootcamp retrieved successfully",
      data: bootcamp,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await bootcampService.updateBootcamp(
      req.params.id,
      req.body,
    );
    return res.status(200).json({
      success: true,
      message: "Bootcamp updated successfully",
      data: bootcamp,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateBootcampStatus = async (req, res, next) => {
  try {
    const bootcamp = await bootcampService.updateBootcampStatus(
      req.params.id,
      req.body.status,
    );
    return res.status(200).json({
      success: true,
      message: "Bootcamp status updated successfully",
      data: bootcamp,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteBootcamp = async (req, res, next) => {
  try {
    const result = await bootcampService.deleteBootcamp(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Bootcamp deleted successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
