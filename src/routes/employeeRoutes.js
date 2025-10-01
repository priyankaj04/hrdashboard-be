const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  getEmployeesByManager,
  updateEmploymentStatus
} = require('../controllers/employeeController');
const { authenticate, authorize, canAccessEmployee } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  createEmployeeSchema,
  updateEmployeeSchema
} = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/', getEmployees);
router.get('/department/:departmentId', getEmployeesByDepartment);
router.get('/manager/:managerId', getEmployeesByManager);

// Routes with employee access control
router.get('/:id', canAccessEmployee, getEmployee);

// Routes for Admin/HR/Manager
router.post('/', authorize('admin', 'hr'), validate(createEmployeeSchema), createEmployee);
router.put('/:id', authorize('admin', 'hr', 'manager'), validate(updateEmployeeSchema), updateEmployee);
router.put('/:id/status', authorize('admin', 'hr'), updateEmploymentStatus);

// Admin only routes
router.delete('/:id', authorize('admin'), deleteEmployee);

module.exports = router;