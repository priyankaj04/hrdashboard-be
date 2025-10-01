const express = require('express');
const DepartmentModel = require('../models/DepartmentModel');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const { authenticate, authorize, canManageDepartment } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
const getDepartments = asyncHandler(async (req, res) => {
  const { include_stats = false } = req.query;

  let departments;
  if (include_stats === 'true') {
    departments = await DepartmentModel.findAllWithStats();
  } else {
    departments = await DepartmentModel.findActiveDepartments();
  }

  res.status(200).json({
    success: true,
    data: departments
  });
});

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private
const getDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await DepartmentModel.findByIdWithManager(id);
  
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  res.status(200).json({
    success: true,
    data: department
  });
});

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin/HR)
const createDepartment = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    manager_id,
    budget,
    color = '#3b82f6'
  } = req.body;

  // Validate required fields
  if (!name) {
    throw new ApiError(400, 'Department name is required');
  }

  const departmentData = {
    name,
    description,
    manager_id,
    budget,
    color,
    is_active: true
  };

  const department = await DepartmentModel.create(departmentData);

  res.status(201).json({
    success: true,
    message: 'Department created successfully',
    data: department
  });
});

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin/HR/Department Manager)
const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Check if department exists
  const department = await DepartmentModel.findById(id);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  // Remove fields that shouldn't be updated directly
  delete updates.id;
  delete updates.created_at;
  delete updates.updated_at;

  const updatedDepartment = await DepartmentModel.update(id, updates);

  res.status(200).json({
    success: true,
    message: 'Department updated successfully',
    data: updatedDepartment
  });
});

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await DepartmentModel.findById(id);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  await DepartmentModel.delete(id);

  res.status(200).json({
    success: true,
    message: 'Department deleted successfully'
  });
});

// @desc    Get department budget stats
// @route   GET /api/departments/:id/budget-stats
// @access  Private
const getDepartmentBudgetStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const stats = await DepartmentModel.getBudgetStats(id);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Update department manager
// @route   PUT /api/departments/:id/manager
// @access  Private (Admin/HR)
const updateDepartmentManager = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { manager_id } = req.body;

  if (!manager_id) {
    throw new ApiError(400, 'Manager ID is required');
  }

  const updatedDepartment = await DepartmentModel.updateManager(id, manager_id);

  res.status(200).json({
    success: true,
    message: 'Department manager updated successfully',
    data: updatedDepartment
  });
});

// Routes
router.get('/', getDepartments);
router.get('/:id', getDepartment);
router.get('/:id/budget-stats', getDepartmentBudgetStats);

// Admin/HR only routes
router.post('/', authorize('admin', 'hr'), createDepartment);
router.put('/:id/manager', authorize('admin', 'hr'), updateDepartmentManager);

// Routes with department access control
router.put('/:id', canManageDepartment, updateDepartment);

// Admin only routes
router.delete('/:id', authorize('admin'), deleteDepartment);

module.exports = router;