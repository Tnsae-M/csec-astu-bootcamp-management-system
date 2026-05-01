import * as userService from "./user.service.js";

const normalizeRole = (roleInput) => {
  if (!roleInput) return undefined;
  let r = roleInput;
  if (Array.isArray(r)) r = r[0];
  if (typeof r !== 'string') return undefined;
  r = r.trim().toLowerCase();
  if (r === 'super' || r === 'superadmin' || r === 'super_admin' || r === 'super-admin') return 'super admin';
  if (r === 'admin') return 'admin';
  if (r === 'instructor') return 'instructor';
  if (r === 'student') return 'student';
  return undefined;
}

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Private (Admin)
 */
export const createUser = async (req, res, next) => {
  try {
    // enforce role creation rules:
    // - super admin (creator) can only create users with role 'admin'
    // - admin (creator) can only create 'instructor' or 'student'
    const creatorRole = req.user && req.user.role ? String(req.user.role).toLowerCase() : null;
    const requestedRole = normalizeRole(req.body.role) || 'student';

    if (creatorRole === 'super admin') {
      // super admin can create anything, but wait, usually they create admin. 
      // We will allow them to create any role except maybe another super admin unless intended.
      if (requestedRole === 'super admin') {
         const error = new Error('Cannot create another super admin via this endpoint.');
         error.statusCode = 403;
         throw error;
      }
    } else if (creatorRole === 'admin') {
      if (!['instructor','student'].includes(requestedRole)) {
        const error = new Error('Admin may only create users with role `instructor` or `student`.');
        error.statusCode = 403;
        throw error;
      }
    } else {
      const error = new Error('Insufficient permissions to create users.');
      error.statusCode = 403;
      throw error;
    }

    // ensure the role written is normalized
    const payload = { ...req.body, role: requestedRole };

    const user = await userService.createUser(payload);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    // Pass the error to the global Express error handler
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    // Optional: Extract basic filters from query params (e.g., ?role=Student&status=Active)
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.status) filters.status = req.query.status;

    const users = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/users/:id
 * @access  Private (Admin)
 */
export const updateUser = async (req, res, next) => {
  try {
    // Prevent role escalations: only super admin can promote to admin
    const updaterRole = req.user && req.user.role ? String(req.user.role).toLowerCase() : null;
    const updateData = { ...req.body };
    if (updateData.role) {
      const normalized = normalizeRole(updateData.role);
      if (!normalized) {
        const error = new Error('Invalid role specified');
        error.statusCode = 400;
        throw error;
      }
      // admin cannot set role to 'admin' or 'super admin'
      if (updaterRole === 'admin' && (normalized === 'admin' || normalized === 'super admin')) {
        const error = new Error('Admin cannot assign admin or super admin roles');
        error.statusCode = 403;
        throw error;
      }
      // only super admin can create/promote to admin
      if (normalized === 'super admin') {
        const error = new Error('Cannot assign super admin role via this endpoint');
        error.statusCode = 403;
        throw error;
      }
      updateData.role = normalized;
    }

    const user = await userService.updateUser(req.params.id, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


