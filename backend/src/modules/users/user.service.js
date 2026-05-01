import User from './user.model.js';
import bcrypt from 'bcrypt';

export const createUser = async (userData) => {
  // Format bootcamps array if provided as raw IDs
  if (userData.bootcamps && Array.isArray(userData.bootcamps)) {
    userData.bootcamps = userData.bootcamps.map(id => ({ bootcampId: id }));
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
  return await User.find(filter)
    .select('-password')
    .populate('divisionId', 'name')
    .populate('bootcamps.bootcampId', 'name title');
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select('-password')
    .populate('divisionId', 'name')
    .populate('bootcamps.bootcampId', 'name title');
    
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

  // Format bootcamps if provided as IDs
  if (updateData.bootcamps && Array.isArray(updateData.bootcamps)) {
    updateData.bootcamps = updateData.bootcamps.map(id => ({ bootcampId: id }));
  }

  const user = await User.findByIdAndUpdate(userId, updateData, { 
    returnDocument: 'after', // Return the updated document
    runValidators: true // Ensure schema rules (like enums) are respected
  })
    .select('-password')
    .populate('divisionId', 'name')
    .populate('bootcamps.bootcampId', 'name title');
  
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