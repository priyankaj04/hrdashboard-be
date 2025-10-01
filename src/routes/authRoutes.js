const express = require('express');
const {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validation');
const {
  loginSchema,
  registerSchema,
  changePasswordSchema
} = require('../utils/validation');

const router = express.Router();

// Public routes
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);

// Protected routes
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', validate(changePasswordSchema), changePassword);

// Admin only routes
router.post('/register', authorize('admin'), validate(registerSchema), register);

module.exports = router;