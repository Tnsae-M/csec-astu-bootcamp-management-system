import * as divisionService from "./division.service.js";

export const createDivision = async (req, res, next) => {
  try {
    const divisionPayload = {
      ...req.body,
      createdBy: req.user.userId,
    };
    const division = await divisionService.createDivision(divisionPayload);
    return res.status(201).json({
      success: true,
      message: "Division created successfully",
      data: division,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDivisions = async (req, res, next) => {
  try {
    const result = await divisionService.getDivisions(req.query.name);
    return res.status(200).json({
      success: true,
      message: "Divisions retrieved successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDivisionById = async (req, res, next) => {
  try {
    const division = await divisionService.getDivisionById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Division retrieved successfully",
      data: division,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateDivision = async (req, res, next) => {
  try {
    const division = await divisionService.updateDivision(
      req.params.id,
      req.body,
    );
    return res.status(200).json({
      success: true,
      message: "Division updated successfully",
      data: division,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteDivision = async (req, res, next) => {
  try {
    const result = await divisionService.deleteDivision(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Division deleted successfully",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
