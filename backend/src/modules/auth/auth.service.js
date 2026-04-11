import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

// In a real application, keep these secrets in your .env file
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'super_secret_access_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'super_secret_refresh_key';

/**
 * Helper to generate JWT tokens
 */
const generateTokens = (userId, role) => {
  // Access Token: Expires in 24 hours (per SRS)
  const accessToken = jwt.sign(
    { id: userId, role }, 
    ACCESS_TOKEN_SECRET, 
    { expiresIn: '24h' }
  );
  
  // Refresh Token: Expires in 7 days (per SRS)
  const refreshToken = jwt.sign(
    { id: userId, role }, 
    REFRESH_TOKEN_SECRET, 
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

export const login = async (email, password) => {
  // 1. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // 2. Ensure they are allowed to log in
  if (user.status === 'Suspended') {
    const error = new Error('User account is suspended');
    error.statusCode = 403; // Forbidden
    throw error;
  }

  // 3. Compare passwords using the method we built in the User model
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 4. Generate the JWT tokens
  const tokens = generateTokens(user._id, user.role);
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    },
    ...tokens
  };
};

export const rotateToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    const error = new Error('Refresh token is required');
    error.statusCode = 401;
    throw error;
  }

  try {
    // This will throw an error if the token is tampered with or expired
    const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
    
    // Issue a brand new set of tokens
    return generateTokens(decoded.id, decoded.role);
  } catch (err) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 403;
    throw error;
  }
};
