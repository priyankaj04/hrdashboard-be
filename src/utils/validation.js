const Joi = require('joi');

// Auth validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'hr', 'manager', 'employee').default('employee')
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required'
  })
});

// Employee validation schemas
const createEmployeeSchema = Joi.object({
  // User data
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'hr', 'manager', 'employee').default('employee'),
  
  // Employee data
  employee_id: Joi.string().required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  date_of_birth: Joi.date().less('now').optional(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').optional(),
  phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).optional(),
  personal_email: Joi.string().email().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  country: Joi.string().default('United States'),
  department_id: Joi.string().uuid().required(),
  position_id: Joi.string().uuid().required(),
  // manager_id: Joi.string().uuid().optional(),
  hire_date: Joi.date().required(),
  employment_status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave').default('active'),
  employment_type: Joi.string().valid('full-time', 'part-time', 'contract', 'intern').default('full-time'),
  salary: Joi.number().positive().required(),
  salary_type: Joi.string().valid('annual', 'monthly', 'weekly', 'hourly').default('annual'),
  currency: Joi.string().length(3).default('USD')
});

const updateEmployeeSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  date_of_birth: Joi.date().less('now').optional(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').optional(),
  phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).optional(),
  personal_email: Joi.string().email().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  country: Joi.string().optional(),
  department_id: Joi.string().uuid().optional(),
  position_id: Joi.string().uuid().optional(),
  // manager_id: Joi.string().uuid().optional(),
  employment_status: Joi.string().valid('active', 'inactive', 'terminated', 'on_leave').optional(),
  employment_type: Joi.string().valid('full-time', 'part-time', 'contract', 'intern').optional(),
  salary: Joi.number().positive().optional(),
  salary_type: Joi.string().valid('annual', 'monthly', 'weekly', 'hourly').optional()
});

// Department validation schemas
const createDepartmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().optional(),
  manager_id: Joi.string().uuid().optional(),
  budget: Joi.number().positive().optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).default('#3b82f6')
});

const updateDepartmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().optional(),
  manager_id: Joi.string().uuid().optional(),
  budget: Joi.number().positive().optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  is_active: Joi.boolean().optional()
});

// Attendance validation schemas
const createAttendanceSchema = Joi.object({
  employee_id: Joi.string().uuid().required(),
  date: Joi.date().required(),
  check_in: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional(),
  check_out: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional(),
  break_start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional(),
  break_end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional(),
  status: Joi.string().valid('present', 'absent', 'late', 'half-day', 'sick', 'vacation', 'holiday').default('present'),
  notes: Joi.string().optional(),
  location: Joi.string().optional()
});

const updateAttendanceSchema = Joi.object({
  check_in: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional(),
  check_out: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional(),
  break_start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional(),
  break_end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional(),
  status: Joi.string().valid('present', 'absent', 'late', 'half-day', 'sick', 'vacation', 'holiday').optional(),
  notes: Joi.string().optional(),
  location: Joi.string().optional()
});

const checkInSchema = Joi.object({
  employee_id: Joi.string().uuid().optional(),
  location: Joi.string().optional()
});

const checkOutSchema = Joi.object({
  employee_id: Joi.string().uuid().optional()
});

// Position validation schemas
const createPositionSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Position title must be at least 2 characters long',
    'string.max': 'Position title cannot exceed 100 characters',
    'any.required': 'Position title is required'
  }),
  department_id: Joi.string().uuid().required().messages({
    'string.guid': 'Department ID must be a valid UUID',
    'any.required': 'Department ID is required'
  }),
  description: Joi.string().optional(),
  responsibilities: Joi.string().optional(),
  requirements: Joi.string().optional(),
  min_salary: Joi.number().positive().optional().messages({
    'number.positive': 'Minimum salary must be a positive number'
  }),
  max_salary: Joi.number().positive().optional().messages({
    'number.positive': 'Maximum salary must be a positive number'
  }),
  salary_currency: Joi.string().length(3).default('USD').messages({
    'string.length': 'Currency code must be 3 characters long'
  }),
  employment_type: Joi.string().valid('full-time', 'part-time', 'contract', 'temporary', 'internship').default('full-time'),
  experience_level: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'lead', 'executive').optional(),
  location_type: Joi.string().valid('on-site', 'remote', 'hybrid').default('on-site'),
  is_active: Joi.boolean().default(true)
}).custom((value, helpers) => {
  // Custom validation to ensure max_salary is greater than min_salary
  if (value.min_salary && value.max_salary && value.min_salary >= value.max_salary) {
    return helpers.error('any.invalid', { 
      message: 'Maximum salary must be greater than minimum salary' 
    });
  }
  return value;
});

const updatePositionSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  department_id: Joi.string().uuid().optional(),
  description: Joi.string().optional(),
  responsibilities: Joi.string().optional(),
  requirements: Joi.string().optional(),
  min_salary: Joi.number().positive().optional(),
  max_salary: Joi.number().positive().optional(),
  salary_currency: Joi.string().length(3).optional(),
  employment_type: Joi.string().valid('full-time', 'part-time', 'contract', 'temporary', 'internship').optional(),
  experience_level: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'lead', 'executive').optional(),
  location_type: Joi.string().valid('on-site', 'remote', 'hybrid').optional(),
  is_active: Joi.boolean().optional()
}).custom((value, helpers) => {
  if (value.min_salary && value.max_salary && value.min_salary >= value.max_salary) {
    return helpers.error('any.invalid', { 
      message: 'Maximum salary must be greater than minimum salary' 
    });
  }
  return value;
});

module.exports = {
  // Auth schemas
  loginSchema,
  registerSchema,
  changePasswordSchema,
  
  // Employee schemas
  createEmployeeSchema,
  updateEmployeeSchema,
  
  // Department schemas
  createDepartmentSchema,
  updateDepartmentSchema,
  
  // Position schemas
  createPositionSchema,
  updatePositionSchema,
  
  // Attendance schemas
  createAttendanceSchema,
  updateAttendanceSchema,
  checkInSchema,
  checkOutSchema
};