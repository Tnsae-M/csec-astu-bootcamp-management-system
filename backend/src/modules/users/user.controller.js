import * as userService from "./user.service.js";

const normalizeRoles = (rolesInput) => {
  if (!rolesInput) return ['student'];
  const inputs = Array.isArray(rolesInput) ? rolesInput : [rolesInput];
  const validRoles = ["super admin", "admin", "instructor", "student"];
  const normalized = inputs
    .map(r => String(r).trim().toLowerCase())
    .map(r => {
      if (r === 'super' || r === 'superadmin' || r === 'super_admin' || r === 'super-admin') return 'super admin';
      return r;
    })
    .filter(r => validRoles.includes(r));
  return normalized.length > 0 ? [...new Set(normalized)] : ['student'];
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
    const creatorRoles = req.user && req.user.roles ? req.user.roles.map(r => String(r).toLowerCase()) : [];
    const requestedRoles = normalizeRoles(req.body.roles || req.body.role);

    const isSuperAdmin = creatorRoles.includes('super admin');
    const isAdmin = creatorRoles.includes('admin');

    if (isSuperAdmin) {
      // Super admin can create anyone
    } else if (isAdmin) {
      // admin can only create instructor or student
      if (requestedRoles.some(r => ['admin', 'super admin'].includes(r))) {
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
    const payload = { ...req.body, roles: requestedRoles };
    delete payload.role;

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
    const filters = {};
    if (req.query.role) {
      filters.roles = { $in: [String(req.query.role).toLowerCase()] };
    }
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
    // Permission Logic:
    // 1. Super Admin can do everything.
    // 2. Admin can update users, but cannot assign 'admin' or 'super admin' roles.
    const updaterRoles = req.user && req.user.roles ? req.user.roles.map(r => String(r).toLowerCase()) : [];
    const isSuperAdmin = updaterRoles.includes('super admin');
    const isAdmin = updaterRoles.includes('admin');

    const updateData = { ...req.body };
    if (updateData.roles || updateData.role) {
      const normalized = normalizeRoles(updateData.roles || updateData.role);
      
      if (!isSuperAdmin) {
        // If not super admin, check if they are trying to assign high-privilege roles
        if (normalized.some(r => ['admin', 'super admin'].includes(r))) {
          // If they are an admin, we might want to allow it ONLY if they aren't CHANGING it to admin.
          // For simplicity, we'll allow Admins to manage non-admins. 
          // If they try to set roles to admin/super admin, we block them unless they are super admin.
          const error = new Error('Insufficient permissions to assign administrative roles');
          error.statusCode = 403;
          throw error;
        }
      }
      updateData.roles = normalized;
      delete updateData.role;
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


