import * as bootcampService from './bootcamp.service.js';
import Bootcamp from "./bootcamp.model.js";
/**
 * @desc    Create a new Bootcamp cohort
 * @route   POST /api/bootcamps
 * @access  Private (Admin)
 */
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error); // ✅ works
  }
};

/**
 * @desc    Get all bootcamps
 * @route   GET /api/bootcamps
 * @access  Public
 */
export const getBootcamps = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status; // Helpful for fetching 'Active' only
    
    const bootcamps = await bootcampService.getBootcamps(filters);
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) { next(error); }
};

/**
 * @desc    Get one bootcamp
 * @route   GET /api/bootcamps/:id
 * @access  Public
 */
export const getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await bootcampService.getBootcampById(req.params.id);
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) { next(error); }
};

/**
 * @desc    Update a bootcamp
 * @route   PUT /api/bootcamps/:id
 * @access  Private (Admin)
 */
export const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await bootcampService.updateBootcamp(req.params.id, req.body);
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) { next(error); }
};

/**
 * @desc    Delete a bootcamp
 * @route   DELETE /api/bootcamps/:id
 * @access  Private (Admin)
 */
export const deleteBootcamp = async (req, res, next) => {
  try {
    await bootcampService.deleteBootcamp(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};
