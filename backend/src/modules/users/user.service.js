import User from './user.model.js';

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 409; // Conflict
    throw error;
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