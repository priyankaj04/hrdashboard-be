const AttendanceModel = require('../models/AttendanceModel');
const EmployeeModel = require('../models/EmployeeModel');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const moment = require('moment');

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendanceRecords = asyncHandler(async (req, res) => {
  const { 
    employee_id, 
    start_date, 
    end_date, 
    date,
    department_id,
    page = 1,
    limit = 10
  } = req.query;

  let records;

  if (employee_id && start_date && end_date) {
    records = await AttendanceModel.findByEmployeeAndDateRange(
      employee_id, 
      start_date, 
      end_date
    );
  } else if (date) {
    records = await AttendanceModel.findByDate(date, department_id);
  } else {
    const filters = {};
    if (employee_id) filters.employee_id = employee_id;
    
    if (department_id) filters.department_id = department_id;
    
    const result = await AttendanceModel.findWithPagination(
      parseInt(page),
      parseInt(limit),
      filters,
      `*, employee:employees(id, first_name, last_name, employee_id, department:departments(name))`
    );
    
    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  }

  res.status(200).json({
    success: true,
    data: records
  });
});

// @desc    Get attendance record by ID
// @route   GET /api/attendance/:id
// @access  Private
const getAttendanceRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await AttendanceModel.findById(id);
  
  if (!record) {
    throw new ApiError(404, 'Attendance record not found');
  }

  res.status(200).json({
    success: true,
    data: record
  });
});

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private
const createAttendanceRecord = asyncHandler(async (req, res) => {
  const {
    employee_id,
    date,
    check_in,
    check_out,
    break_start,
    break_end,
    status = 'present',
    notes,
    location
  } = req.body;

  // Validate required fields
  if (!employee_id || !date) {
    throw new ApiError(400, 'Employee ID and date are required');
  }

  // Check if employee exists
  const employee = await EmployeeModel.findById(employee_id);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  // Check if attendance record already exists for this employee and date
  const existingRecord = await AttendanceModel.findByEmployeeAndDate(employee_id, date);
  if (existingRecord) {
    throw new ApiError(400, 'Attendance record already exists for this date');
  }

  // Calculate total hours if both check_in and check_out are provided
  let total_hours = null;
  let overtime_hours = 0;

  if (check_in && check_out) {
    const checkInTime = moment(`${date} ${check_in}`);
    const checkOutTime = moment(`${date} ${check_out}`);
    
    if (checkOutTime.isAfter(checkInTime)) {
      total_hours = checkOutTime.diff(checkInTime, 'hours', true);
      
      // Calculate overtime (assuming 8 hours is standard)
      const standardHours = 8;
      overtime_hours = Math.max(0, total_hours - standardHours);
      
      // Round to 2 decimal places
      total_hours = Math.round(total_hours * 100) / 100;
      overtime_hours = Math.round(overtime_hours * 100) / 100;
    }
  }

  const attendanceData = {
    employee_id,
    date,
    check_in,
    check_out,
    break_start,
    break_end,
    total_hours,
    overtime_hours,
    status,
    notes,
    location,
    ip_address: req.ip
  };

  const record = await AttendanceModel.create(attendanceData);

  res.status(201).json({
    success: true,
    message: 'Attendance record created successfully',
    data: record
  });
});

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
const updateAttendanceRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Check if record exists
  const record = await AttendanceModel.findById(id);
  if (!record) {
    throw new ApiError(404, 'Attendance record not found');
  }

  // Recalculate total hours if check times are updated
  if (updates.check_in || updates.check_out) {
    const checkIn = updates.check_in || record.check_in;
    const checkOut = updates.check_out || record.check_out;
    
    if (checkIn && checkOut) {
      const checkInTime = moment(`${record.date} ${checkIn}`);
      const checkOutTime = moment(`${record.date} ${checkOut}`);
      
      if (checkOutTime.isAfter(checkInTime)) {
        const totalHours = checkOutTime.diff(checkInTime, 'hours', true);
        const standardHours = 8;
        const overtimeHours = Math.max(0, totalHours - standardHours);
        
        updates.total_hours = Math.round(totalHours * 100) / 100;
        updates.overtime_hours = Math.round(overtimeHours * 100) / 100;
      }
    }
  }

  const updatedRecord = await AttendanceModel.update(id, updates);

  res.status(200).json({
    success: true,
    message: 'Attendance record updated successfully',
    data: updatedRecord
  });
});

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin/HR only)
const deleteAttendanceRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await AttendanceModel.findById(id);
  if (!record) {
    throw new ApiError(404, 'Attendance record not found');
  }

  await AttendanceModel.delete(id);

  res.status(200).json({
    success: true,
    message: 'Attendance record deleted successfully'
  });
});

// @desc    Check in employee
// @route   POST /api/attendance/check-in
// @access  Private
const checkIn = asyncHandler(async (req, res) => {
  const { employee_id, date, check_in, location, notes } = req.body;
  
  // Use provided date or current date
  const targetDate = date || moment().format('YYYY-MM-DD');
  const checkInTime = check_in || moment().format('HH:mm:ss');
  
  // Use current user's employee ID if not provided and user is not admin/HR
  const targetEmployeeId = employee_id || (req.employee ? req.employee.id : null);
  
  if (!targetEmployeeId) {
    throw new ApiError(400, 'Employee ID is required');
  }

  // Check if employee exists
  const employee = await EmployeeModel.findById(targetEmployeeId);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  const record = await AttendanceModel.checkIn(
    targetEmployeeId, 
    targetDate, 
    checkInTime, 
    location, 
    req.ip
  );

  // Update notes if provided
  if (notes && record) {
    await AttendanceModel.update(record.id, { notes });
    record.notes = notes;
  }

  res.status(200).json({
    success: true,
    message: 'Check-in successful',
    data: {
      id: record.id,
      employee_id: targetEmployeeId,
      date: targetDate,
      check_in: checkInTime,
      status: record.status,
      created_at: record.created_at
    }
  });
});

// @desc    Check out employee
// @route   POST /api/attendance/check-out
// @access  Private
const checkOut = asyncHandler(async (req, res) => {
  const { employee_id, date, check_out, notes } = req.body;
  
  // Use provided date or current date
  const targetDate = date || moment().format('YYYY-MM-DD');
  const checkOutTime = check_out || moment().format('HH:mm:ss');
  
  // Use current user's employee ID if not provided and user is not admin/HR
  const targetEmployeeId = employee_id || (req.employee ? req.employee.id : null);
  
  if (!targetEmployeeId) {
    throw new ApiError(400, 'Employee ID is required');
  }

  const record = await AttendanceModel.checkOut(targetEmployeeId, targetDate, checkOutTime);

  // Update notes if provided
  if (notes && record) {
    await AttendanceModel.update(record.id, { notes });
    record.notes = notes;
  }

  res.status(200).json({
    success: true,
    message: 'Check-out successful',
    data: {
      id: record.id,
      employee_id: targetEmployeeId,
      date: targetDate,
      check_in: record.check_in,
      check_out: checkOutTime,
      total_hours: record.total_hours,
      status: record.status,
      updated_at: record.updated_at
    }
  });
});

// @desc    Get employee attendance summary
// @route   GET /api/attendance/summary/:employeeId
// @access  Private
const getEmployeeSummary = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const { month = moment().month() + 1, year = moment().year() } = req.query;

  const summary = await AttendanceModel.getEmployeeSummary(
    employeeId, 
    parseInt(month), 
    parseInt(year)
  );

  res.status(200).json({
    success: true,
    data: summary
  });
});

// @desc    Get department attendance summary
// @route   GET /api/attendance/department-summary/:departmentId
// @access  Private
const getDepartmentSummary = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const { date = moment().format('YYYY-MM-DD') } = req.query;

  const summary = await AttendanceModel.getDepartmentSummary(departmentId, date);

  res.status(200).json({
    success: true,
    data: summary
  });
});

// @desc    Get monthly attendance data
// @route   GET /api/attendance/monthly
// @access  Private
const getMonthlyAttendance = asyncHandler(async (req, res) => {
  const { month, year, department_id, employee_id } = req.query;

  // Validate required parameters
  if (!month || !year) {
    throw new ApiError(400, 'Month and year are required');
  }

  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  // Validate month and year
  if (monthNum < 1 || monthNum > 12) {
    throw new ApiError(400, 'Month must be between 1 and 12');
  }

  if (yearNum < 2020 || yearNum > new Date().getFullYear() + 1) {
    throw new ApiError(400, 'Invalid year');
  }

  const data = await AttendanceModel.getMonthlyAttendance(
    monthNum,
    yearNum,
    department_id,
    employee_id
  );

  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get daily attendance data
// @route   GET /api/attendance/daily
// @access  Private
const getDailyAttendance = asyncHandler(async (req, res) => {
  const { date, department_id, employee_id } = req.query;

  // Validate required parameters
  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ApiError(400, 'Date must be in YYYY-MM-DD format');
  }

  const data = await AttendanceModel.getDailyAttendance(
    date,
    department_id,
    employee_id
  );

  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get attendance analytics
// @route   GET /api/attendance/analytics
// @access  Private (Admin/HR)
const getAttendanceAnalytics = asyncHandler(async (req, res) => {
  const { start_date, end_date, period } = req.query;

  // Validate date format if provided
  if (start_date && !moment(start_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid start_date format. Use YYYY-MM-DD');
  }

  if (end_date && !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid end_date format. Use YYYY-MM-DD');
  }

  // Validate period if provided
  const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
  if (period && !validPeriods.includes(period)) {
    throw new ApiError(400, `Invalid period. Must be one of: ${validPeriods.join(', ')}`);
  }

  const analytics = await AttendanceModel.getAnalytics(start_date, end_date, period);

  res.status(200).json({
    success: true,
    data: analytics
  });
});

// @desc    Get employees with attendance summary
// @route   GET /api/attendance/employees
// @access  Private (Admin/HR)
const getEmployeesWithAttendance = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    department_id, 
    search, 
    start_date, 
    end_date 
  } = req.query;

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (pageNum < 1) {
    throw new ApiError(400, 'Page must be greater than 0');
  }

  if (limitNum < 1 || limitNum > 100) {
    throw new ApiError(400, 'Limit must be between 1 and 100');
  }

  // Validate date format if provided
  if (start_date && !moment(start_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid start_date format. Use YYYY-MM-DD');
  }

  if (end_date && !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid end_date format. Use YYYY-MM-DD');
  }

  const result = await AttendanceModel.getEmployeesWithAttendance(
    pageNum, 
    limitNum, 
    department_id, 
    search, 
    start_date, 
    end_date
  );

  res.status(200).json({
    success: true,
    data: result
  });
});

// @desc    Get departments with attendance statistics
// @route   GET /api/attendance/departments
// @access  Private (Admin/HR)
const getDepartmentsWithStats = asyncHandler(async (req, res) => {
  const { start_date, end_date } = req.query;

  // Validate date format if provided
  if (start_date && !moment(start_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid start_date format. Use YYYY-MM-DD');
  }

  if (end_date && !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid end_date format. Use YYYY-MM-DD');
  }

  const result = await AttendanceModel.getDepartmentsWithStats(start_date, end_date);

  res.status(200).json({
    success: true,
    data: result
  });
});

// @desc    Export attendance data
// @route   GET /api/attendance/export
// @access  Private (Admin/HR)
const exportAttendanceData = asyncHandler(async (req, res) => {
  const { 
    start_date, 
    end_date, 
    department_id, 
    employee_id, 
    format = 'csv' 
  } = req.query;

  // Validate date format if provided
  if (start_date && !moment(start_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid start_date format. Use YYYY-MM-DD');
  }

  if (end_date && !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
    throw new ApiError(400, 'Invalid end_date format. Use YYYY-MM-DD');
  }

  // Validate format
  const validFormats = ['csv', 'json'];
  if (!validFormats.includes(format)) {
    throw new ApiError(400, `Invalid format. Must be one of: ${validFormats.join(', ')}`);
  }

  const exportResult = await AttendanceModel.getAttendanceForExport(
    start_date, 
    end_date, 
    department_id, 
    employee_id, 
    format
  );

  if (format === 'csv') {
    const csvContent = AttendanceModel.generateCSV(exportResult.data, exportResult.summary);
    
    // Generate filename
    const startStr = start_date || moment().startOf('month').format('YYYY-MM-DD');
    const endStr = end_date || moment().endOf('month').format('YYYY-MM-DD');
    const filename = `attendance_export_${startStr}_to_${endStr}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } else {
    // JSON format
    const startStr = start_date || moment().startOf('month').format('YYYY-MM-DD');
    const endStr = end_date || moment().endOf('month').format('YYYY-MM-DD');
    const filename = `attendance_export_${startStr}_to_${endStr}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json({
      success: true,
      ...exportResult
    });
  }
});

module.exports = {
  getAttendanceRecords,
  getAttendanceRecord,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  checkIn,
  checkOut,
  getEmployeeSummary,
  getDepartmentSummary,
  getMonthlyAttendance,
  getDailyAttendance,
  getAttendanceAnalytics,
  getEmployeesWithAttendance,
  getDepartmentsWithStats,
  exportAttendanceData
};