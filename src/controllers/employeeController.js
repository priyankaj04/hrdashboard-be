const EmployeeModel = require('../models/EmployeeModel');
const UserModel = require('../models/UserModel');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const { hashPassword } = require('../utils/auth');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = asyncHandler(async (req, res) => {
  const { 
    page = 0, 
    limit = 0, 
    department_id, 
    employment_status = 'active',
    search 
  } = req.query;

  let employees;

  if (search) {
    employees = await EmployeeModel.searchByName(search);
  } else {
    const filters = {};
    if (department_id) filters.department_id = department_id;
    if (employment_status) filters.employment_status = employment_status;

    if (page && limit) {
      const result = await EmployeeModel.findWithPagination(
        parseInt(page), 
        parseInt(limit), 
        filters
      );
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } else {
      employees = await EmployeeModel.findAllWithRelations(filters);
    }
  }

  res.status(200).json({
    success: true,
    data: employees
  });
});

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await EmployeeModel.findByIdWithUser(id);
  
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  res.status(200).json({
    success: true,
    data: employee
  });
});

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private (Admin/HR)
const createEmployee = asyncHandler(async (req, res) => {
  const {
    // User data
    email,
    password,
    role = 'employee',
    
    // Employee data
    employee_id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    personal_email,
    address,
    city,
    state,
    postal_code,
    country = 'United States',
    department_id,
    position_id,
    manager_id,
    hire_date,
    employment_status = 'active',
    employment_type = 'full-time',
    salary,
    salary_type = 'annual',
    currency = 'USD'
  } = req.body;

  // Validate required fields
  if (!email || !password || !employee_id || !first_name || !last_name || 
      !department_id || !position_id || !hire_date || !salary) {
    throw new ApiError(400, 'Please provide all required fields');
  }

  // Check if user email already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  // Check if employee ID already exists
  const existingEmployee = await EmployeeModel.findByEmployeeId(employee_id);
  if (existingEmployee) {
    throw new ApiError(400, 'Employee ID already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user first
  const userData = {
    email,
    password_hash: hashedPassword,
    role,
    is_active: true
  };

  const user = await UserModel.create(userData);

  // Create employee
  const employeeData = {
    user_id: user.id,
    employee_id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    personal_email,
    address,
    city,
    state,
    postal_code,
    country,
    department_id,
    position_id,
    manager_id,
    hire_date,
    employment_status,
    employment_type,
    salary,
    salary_type,
    currency
  };

  const employee = await EmployeeModel.create(employeeData);
  
  // Get full employee data with relations
  const newEmployee = await EmployeeModel.findByIdWithUser(employee.id);

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: newEmployee
  });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin/HR/Manager)
const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Check if employee exists
  const employee = await EmployeeModel.findById(id);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  // Remove fields that shouldn't be updated directly
  delete updates.id;
  delete updates.user_id;
  delete updates.created_at;
  delete updates.updated_at;

  const updatedEmployee = await EmployeeModel.update(id, updates);
  
  // Get full employee data with relations
  const fullEmployee = await EmployeeModel.findByIdWithUser(updatedEmployee.id);

  res.status(200).json({
    success: true,
    message: 'Employee updated successfully',
    data: fullEmployee
  });
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await EmployeeModel.findById(id);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  // Delete employee (this will also delete the user due to CASCADE)
  await EmployeeModel.delete(id);

  res.status(200).json({
    success: true,
    message: 'Employee deleted successfully'
  });
});

// @desc    Get employees by department
// @route   GET /api/employees/department/:departmentId
// @access  Private
const getEmployeesByDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  const employees = await EmployeeModel.findByDepartment(departmentId);

  res.status(200).json({
    success: true,
    data: employees
  });
});

// @desc    Get employees by manager
// @route   GET /api/employees/manager/:managerId
// @access  Private
const getEmployeesByManager = asyncHandler(async (req, res) => {
  const { managerId } = req.params;

  const employees = await EmployeeModel.findByManager(managerId);

  res.status(200).json({
    success: true,
    data: employees
  });
});

// @desc    Update employment status
// @route   PUT /api/employees/:id/status
// @access  Private (Admin/HR)
const updateEmploymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { employment_status, termination_date } = req.body;

  if (!employment_status) {
    throw new ApiError(400, 'Employment status is required');
  }

  const updatedEmployee = await EmployeeModel.updateEmploymentStatus(
    id, 
    employment_status, 
    termination_date
  );

  res.status(200).json({
    success: true,
    message: 'Employment status updated successfully',
    data: updatedEmployee
  });
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  getEmployeesByManager,
  updateEmploymentStatus
};