import * as authService from './auth.service.js';

/**
 * @desc    Login user and get tokens
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Quick validation before hitting the service
    if (!email || !password) {
      const error = new Error('Please provide an email and password');
      error.statusCode = 400; // Validation Error (as per SRS Error Handling)
      throw error;
    }

    const authData = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: authData // This contains the user object and the two tokens
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get new access & refresh tokens
 * @route   POST /api/auth/refresh
 * @access  Public (requires valid refresh token)
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      const error = new Error('Refresh token is required in the request body');
      error.statusCode = 400; // Validation Error
      throw error;
    }

    const newTokens = await authService.rotateToken(refreshToken);
    
    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: newTokens
    });
  } catch (error) {
    next(error);
  }
};
