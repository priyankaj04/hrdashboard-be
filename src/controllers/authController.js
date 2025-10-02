const { generateToken, hashPassword, comparePassword } = require('../utils/auth');
const UserModel = require('../models/UserModel');
const EmployeeModel = require('../models/EmployeeModel');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  // Find user by email
  const user = await UserModel.findByEmail(email);
  console.log("user", user)
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if user is active
  if (!user.is_active) {
    throw new ApiError(401, 'Account is deactivated. Please contact administrator.');
  }

  const hash = await hashPassword('admin@123');
  console.log("hash", hash)

  // Verify password
  console.log("password, user.password_hash", password, user.password_hash)
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Update last login
  await UserModel.updateLastLogin(user.id);

  // Get employee data if applicable
  let employee = null;
  if (user.role !== 'admin') {
    employee = await EmployeeModel.findByUserId(user.id);
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  // Remove password from response
  const { password_hash, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: userWithoutPassword,
      employee
    }
  });
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Private (Admin only)
const register = asyncHandler(async (req, res) => {
  const { email, password, role = 'employee' } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const userData = {
    email,
    password_hash: hashedPassword,
    role,
    is_active: true
  };

  const user = await UserModel.create(userData);

  // Remove password from response
  const { password_hash, ...userWithoutPassword } = user;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: userWithoutPassword
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  let employee = null;

  // Get employee data if applicable
  if (user.role !== 'admin') {
    employee = await EmployeeModel.findByUserId(user.id);
  }

  // Remove password from response
  const { password_hash, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    data: {
      user: userWithoutPassword,
      employee
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { email } = req.body;

  const updates = {};
  
  if (email && email !== req.user.email) {
    // Check if email is already taken
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      throw new ApiError(400, 'Email already in use');
    }
    updates.email = email;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'No valid updates provided');
  }

  const updatedUser = await UserModel.update(userId, updates);
  
  // Remove password from response
  const { password_hash, ...userWithoutPassword } = updatedUser;

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: userWithoutPassword
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Please provide current password and new password');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, req.user.password_hash);
  if (!isCurrentPasswordValid) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);

  // Update password
  await UserModel.update(userId, { password_hash: hashedNewPassword });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  logout
};