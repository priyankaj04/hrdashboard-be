const LeaveModel = require('../models/LeaveModel');
const EmployeeModel = require('../models/EmployeeModel');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const moment = require('moment');

// @desc    Get leave requests
// @route   GET /api/leaves
// @access  Private
const getLeaveRequests = asyncHandler(async (req, res) => {
  const { 
    employee_id, 
    status = 'all', 
    type, 
    start_date, 
    end_date, 
  } = req.query;

  // Non-admin users can only see their own leaves
  let targetEmployeeId = employee_id;
  if (req.user.role === 'employee' && !req.user.isAdmin) {
    targetEmployeeId = req.employee ? req.employee.id : null;
    if (!targetEmployeeId) {
      throw new ApiError(403, 'Access denied');
    }
  }

  // Validate date format if provided
  if (start_date && !moment(start_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid start_date format. Use YYYY-MM-DD');
  }

  if (end_date && !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid end_date format. Use YYYY-MM-DD');
  }


  const filters = {
    employee_id: targetEmployeeId,
    status,
    type,
    start_date,
    end_date
  };

  const result = await LeaveModel.findAllPaginated(filters);

  res.status(200).json({
    success: true,
    data: result
  });
});

// @desc    Create leave request
// @route   POST /api/leaves
// @access  Private
const createLeaveRequest = asyncHandler(async (req, res) => {
  const { 
    employee_id, 
    leave_type_id, 
    start_date, 
    end_date, 
    reason, 
    contact_info 
  } = req.body;

  // Use current user's employee ID if not provided and user is not admin/HR
  let targetEmployeeId = employee_id;
  if (req.user.role === 'employee' && !req.user.isAdmin) {
    targetEmployeeId = req.employee ? req.employee.id : null;
    if (!targetEmployeeId) {
      throw new ApiError(403, 'Access denied');
    }
  }

  // Validate required fields
  if (!targetEmployeeId || !leave_type_id || !start_date || !end_date || !reason) {
    throw new ApiError(400, 'Employee ID, type, start date, end date, and reason are required');
  }

  // Validate date format
  if (!moment(start_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid start_date format. Use YYYY-MM-DD');
  }

  if (!moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid end_date format. Use YYYY-MM-DD');
  }

  // Validate date logic
  if (moment(start_date).isAfter(moment(end_date))) {
    throw new ApiError(400, 'Start date cannot be after end date');
  }

  // Check if employee exists
  const employee = await EmployeeModel.findById(targetEmployeeId);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  // Check for overlapping leave requests
  const overlapping = await LeaveModel.checkOverlap(targetEmployeeId, start_date, end_date);
  if (overlapping.length > 0) {
    throw new ApiError(400, 'Leave request overlaps with existing leave');
  }

  const leaveData = {
    employee_id: targetEmployeeId,
    leave_type_id,
    start_date,
    end_date,
    reason,
    contact_info
  };

  const leave = await LeaveModel.createLeaveRequest(leaveData);

  res.status(201).json({
    success: true,
    message: 'Leave request submitted successfully',
    data: {
      id: leave.id,
      employee_id: leave.employee_id,
      leave_type_id: leave.leave_type_id,
      start_date: leave.start_date,
      end_date: leave.end_date,
      days: leave.total_days,
      reason: leave.reason,
      status: leave.status,
      applied_date: leave.applied_date,
      created_at: leave.created_at
    }
  });
});

// @desc    Approve/Reject leave request
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin/HR/Manager)
const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;

  // Validate status
  if (!['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Status must be either approved or rejected');
  }

  // Check if leave request exists
  const leave = await LeaveModel.findById(id);
  if (!leave) {
    throw new ApiError(404, 'Leave request not found');
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Can only update pending leave requests');
  }

  const statusData = {
    status,
    comments,
    approved_by: req.employee ? req.employee.id : null
  };

  const updatedLeave = await LeaveModel.updateStatus(id, statusData);

  res.status(200).json({
    success: true,
    message: `Leave request ${status} successfully`,
    data: {
      id: updatedLeave.id,
      status: updatedLeave.status,
      approved_by: req.employee ? `${req.employee.first_name} ${req.employee.last_name}` : null,
      approved_date: updatedLeave.approved_date,
      comments: updatedLeave.rejection_reason
    }
  });
});

// @desc    Get leave statistics
// @route   GET /api/leaves/statistics
// @access  Private
const getLeaveStatistics = asyncHandler(async (req, res) => {
  const { employee_id, department_id, year, month } = req.query;

  // Non-admin users can only see their own statistics
  let targetEmployeeId = employee_id;
  if (req.user.role === 'employee' && !req.user.isAdmin) {
    targetEmployeeId = req.employee ? req.employee.id : null;
  }

  // Validate year and month if provided
  if (year && (isNaN(year) || year < 2000 || year > 3000)) {
    throw new ApiError(400, 'Invalid year format');
  }

  if (month && (isNaN(month) || month < 1 || month > 12)) {
    throw new ApiError(400, 'Invalid month format. Use 1-12');
  }

  const filters = {
    employee_id: targetEmployeeId,
    department_id,
    year: year ? parseInt(year) : undefined,
    month: month ? parseInt(month) : undefined
  };

  const statistics = await LeaveModel.getLeaveStatistics(filters);

  res.status(200).json({
    success: true,
    data: statistics
  });
});

// @desc    Get employee leave balance
// @route   GET /api/leaves/balance/:employee_id
// @access  Private
const getEmployeeLeaveBalance = asyncHandler(async (req, res) => {
  const { employee_id } = req.params;
  const { year } = req.query;

  // Non-admin users can only see their own balance
  let targetEmployeeId = employee_id;
  if (req.user.role === 'employee' && !req.user.isAdmin) {
    targetEmployeeId = req.employee ? req.employee.id : null;
    if (targetEmployeeId !== employee_id) {
      throw new ApiError(403, 'Access denied');
    }
  }

  // Check if employee exists
  const employee = await EmployeeModel.findById(targetEmployeeId);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  const currentYear = year ? parseInt(year) : new Date().getFullYear();
  
  // Get detailed balance with leave types
  const balance = await LeaveModel.getEmployeeLeaveBalance(targetEmployeeId, currentYear);

  // Get leave types for detailed breakdown
  const leaveTypes = await LeaveModel.getLeaveTypes();
  const leaveTypeBalances = {};

  leaveTypes.forEach(type => {
    // Get specific usage for this type
    leaveTypeBalances[type.id] = {
      allocated: type.max_days,
      used: 0, // This would need to be calculated separately for detailed breakdown
      pending: 0,
      remaining: type.max_days
    };
  });

  res.status(200).json({
    success: true,
    data: {
      employee_id: targetEmployeeId,
      leave_types: leaveTypeBalances,
      total_days: balance
    }
  });
});

// @desc    Update leave request
// @route   PUT /api/leaves/:id
// @access  Private
const updateLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, start_date, end_date, reason, contact_info } = req.body;

  // Check if leave request exists and belongs to user
  const leave = await LeaveModel.findById(id);
  if (!leave) {
    throw new ApiError(404, 'Leave request not found');
  }

  // Non-admin users can only update their own leave requests
  if (req.user.role === 'employee' && !req.user.isAdmin) {
    const userEmployeeId = req.employee ? req.employee.id : null;
    if (leave.employee_id !== userEmployeeId) {
      throw new ApiError(403, 'Access denied');
    }
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Can only update pending leave requests');
  }

  // Validate dates if provided
  if (start_date && !moment(start_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid start_date format. Use YYYY-MM-DD');
  }

  if (end_date && !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid end_date format. Use YYYY-MM-DD');
  }

  // Validate date logic if both dates provided
  if (start_date && end_date && moment(start_date).isAfter(moment(end_date))) {
    throw new ApiError(400, 'Start date cannot be after end date');
  }

  // Check for overlapping leave requests if dates are being changed
  if (start_date || end_date) {
    const newStartDate = start_date || leave.start_date;
    const newEndDate = end_date || leave.end_date;
    
    const overlapping = await LeaveModel.checkOverlap(leave.employee_id, newStartDate, newEndDate, id);
    if (overlapping.length > 0) {
      throw new ApiError(400, 'Updated leave request overlaps with existing leave');
    }
  }

  const updateData = {
    type,
    start_date,
    end_date,
    reason,
    contact_info
  };

  const updatedLeave = await LeaveModel.updateLeaveRequest(id, updateData);

  res.status(200).json({
    success: true,
    message: 'Leave request updated successfully',
    data: {
      id: updatedLeave.id,
      type: updatedLeave.type,
      start_date: updatedLeave.start_date,
      end_date: updatedLeave.end_date,
      days: updatedLeave.total_days,
      reason: updatedLeave.reason,
      status: updatedLeave.status,
      updated_at: updatedLeave.updated_at
    }
  });
});

// @desc    Cancel leave request
// @route   DELETE /api/leaves/:id
// @access  Private
const cancelLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if leave request exists
  const leave = await LeaveModel.findById(id);
  if (!leave) {
    throw new ApiError(404, 'Leave request not found');
  }

  // Non-admin users can only cancel their own leave requests
  if (req.user.role === 'employee' && !req.user.isAdmin) {
    const userEmployeeId = req.employee ? req.employee.id : null;
    if (leave.employee_id !== userEmployeeId) {
      throw new ApiError(403, 'Access denied');
    }
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Can only cancel pending leave requests');
  }

  await LeaveModel.cancel(id, leave.employee_id);

  res.status(200).json({
    success: true,
    message: 'Leave request cancelled successfully'
  });
});

// @desc    Get leave calendar
// @route   GET /api/leaves/calendar
// @access  Private
const getLeaveCalendar = asyncHandler(async (req, res) => {
  const { start_date, end_date, department_id, employee_id } = req.query;

  // Validate required dates
  if (!start_date || !end_date) {
    throw new ApiError(400, 'Start date and end date are required');
  }

  // Validate date format
  if (!moment(start_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid start_date format. Use YYYY-MM-DD');
  }

  if (!moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid end_date format. Use YYYY-MM-DD');
  }

  // Non-admin users can only see their own calendar
  let targetEmployeeId = employee_id;
  if (req.user.role === 'employee' && !req.user.isAdmin) {
    targetEmployeeId = req.employee ? req.employee.id : null;
  }

  const filters = {
    department_id,
    employee_id: targetEmployeeId
  };

  const calendar = await LeaveModel.getLeaveCalendar(start_date, end_date, filters);

  res.status(200).json({
    success: true,
    data: calendar
  });
});

// @desc    Get leave types
// @route   GET /api/leaves/types
// @access  Private
const getLeaveTypes = asyncHandler(async (req, res) => {
  const leaveTypes = await LeaveModel.getLeaveTypes();

  res.status(200).json({
    success: true,
    data: leaveTypes
  });
});

// @desc    Bulk approve/reject leave requests
// @route   POST /api/leaves/bulk-action
// @access  Private (Admin/HR/Manager)
const bulkActionLeaves = asyncHandler(async (req, res) => {
  const { action, leave_ids, comments } = req.body;

  // Validate action
  if (!['approve', 'reject'].includes(action)) {
    throw new ApiError(400, 'Action must be either approve or reject');
  }

  // Validate leave_ids
  if (!Array.isArray(leave_ids) || leave_ids.length === 0) {
    throw new ApiError(400, 'Leave IDs array is required and must not be empty');
  }

  const status = action === 'approve' ? 'approved' : 'rejected';
  const statusData = {
    status,
    comments,
    approved_by: req.employee ? req.employee.id : null
  };

  const result = await LeaveModel.bulkUpdateStatus(leave_ids, statusData);

  res.status(200).json({
    success: true,
    message: 'Bulk action completed',
    data: result
  });
});

module.exports = {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  getLeaveStatistics,
  getEmployeeLeaveBalance,
  updateLeaveRequest,
  cancelLeaveRequest,
  getLeaveCalendar,
  getLeaveTypes,
  bulkActionLeaves
};