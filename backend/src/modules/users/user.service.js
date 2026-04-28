import User from './user.model.js';
import bcrypt from 'bcrypt';

export const createUser = async (userData) => {
  // Normalize role when provided as an array or with differing case
  if (Array.isArray(userData.role)) {
    userData.role = String(userData.role[0] || '').toLowerCase();
  } else if (typeof userData.role === 'string') {
    userData.role = userData.role.toLowerCase();
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 409; // Conflict
    throw error;
  }
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  const user = new User(userData);
  await user.save();
  
  // Return user without password
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

export const getAllUsers = async (filter = {}) => {
  // We exclude the password from the results for security
  return await User.find(filter).select('-password');
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
    
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateUser = async (userId, updateData) => {
  // Prevent password updates through this generic method
  if (updateData.password) {
    delete updateData.password;
  }

  // Normalize role if provided as an array or different casing
  if (updateData.role) {
    if (Array.isArray(updateData.role)) {
      updateData.role = String(updateData.role[0] || '').toLowerCase();
    } else if (typeof updateData.role === 'string') {
      updateData.role = updateData.role.toLowerCase();
    }
  }

  const user = await User.findByIdAndUpdate(userId, updateData, { 
    new: true, // Return the updated document
    runValidators: true // Ensure schema rules (like enums) are respected
  }).select('-password');
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  return user;
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};