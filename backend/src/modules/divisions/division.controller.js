import * as divisionService from './division.service.js';

/**
 * @desc    Create a new division
 * @route   POST /api/divisions
 * @access  Private (Admin)
 */
export const createDivision = async (req, res, next) => {
  try {
    const division = await divisionService.createDivision(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Division created successfully',
      data: division
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all divisions
 * @route   GET /api/divisions
 * @access  Public or Private (depending on requirements, usually public to see options)
 */
export const getAllDivisions = async (req, res, next) => {
  try {
    const divisions = await divisionService.getAllDivisions();
    
    res.status(200).json({
      success: true,
      count: divisions.length,
      data: divisions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single division
 * @route   GET /api/divisions/:id
 * @access  Public or Private
 */
export const getDivisionById = async (req, res, next) => {
  try {
    const division = await divisionService.getDivisionById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: division
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a division
 * @route   PUT /api/divisions/:id
 * @access  Private (Admin)
 */
export const updateDivision = async (req, res, next) => {
  try {
    const division = await divisionService.updateDivision(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Division updated successfully',
      data: division
    });
  } catch (error) {
    next(error);
  }
};
