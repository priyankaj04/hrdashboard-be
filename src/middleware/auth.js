const { verifyToken, extractTokenFromHeader } = require('../utils/auth');
const UserModel = require('../models/UserModel');
const EmployeeModel = require('../models/EmployeeModel');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Get employee data if user is an employee
    let employee = null;
    if (user.role !== 'admin') {
      employee = await EmployeeModel.findByUserId(user.id);
    }

    // Attach user and employee data to request
    req.user = user;
    req.employee = employee;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Authorization middleware - check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user can access employee data (themselves, their reports, or admin/HR)
const canAccessEmployee = async (req, res, next) => {
  try {
    const targetEmployeeId = req.params.id || req.params.employeeId;
    const user = req.user;

    // Admin and HR can access all employee data
    if (['admin', 'hr'].includes(user.role)) {
      return next();
    }

    // Managers can access their direct reports
    if (user.role === 'manager' && req.employee) {
      const targetEmployee = await EmployeeModel.findById(targetEmployeeId);
      if (targetEmployee && targetEmployee.manager_id === req.employee.id) {
        return next();
      }
    }

    // Employees can only access their own data
    if (req.employee && req.employee.id === targetEmployeeId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied to this employee data'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking employee access',
      error: error.message
    });
  }
};

// Check if user can manage department (department manager, admin, or HR)
const canManageDepartment = async (req, res, next) => {
  try {
    const departmentId = req.params.id || req.params.departmentId;
    const user = req.user;

    // Admin and HR can manage all departments
    if (['admin', 'hr'].includes(user.role)) {
      return next();
    }

    // Check if user is the department manager
    const DepartmentModel = require('../models/DepartmentModel');
    const department = await DepartmentModel.findById(departmentId);
    
    if (department && department.manager_id === user.id) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied to manage this department'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking department access',
      error: error.message
    });
  }
};

// Check if user can approve leave requests
const canApproveLeave = async (req, res, next) => {
  try {
    const user = req.user;

    // Admin and HR can approve all leave requests
    if (['admin', 'hr'].includes(user.role)) {
      return next();
    }

    // Managers can approve leave requests for their team
    if (user.role === 'manager') {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied to approve leave requests'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking leave approval access',
      error: error.message
    });
  }
};

// Optional authentication - don't fail if no token provided
const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      await authenticate(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  canAccessEmployee,
  canManageDepartment,
  canApproveLeave,
  optionalAuth
};