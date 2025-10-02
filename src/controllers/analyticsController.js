const asyncHandler = require('../middleware/asyncHandler');
const AnalyticsModel = require('../models/AnalyticsModel');
const { ApiError } = require('../utils/apiError');

// @desc    Get hiring and resignation analytics
// @route   GET /api/analytics/hiring-resignation
// @access  Private (HR/Admin)
const getHiringResignationData = asyncHandler(async (req, res) => {
  const { period = 'month', year, month, department } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1,
    department
  };

  const data = await AnalyticsModel.getHiringResignationData(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get hiring trend analytics
// @route   GET /api/analytics/hiring-trend
// @access  Private (HR/Admin)
const getHiringTrend = asyncHandler(async (req, res) => {
  const { period = 'month', year } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear()
  };

  const data = await AnalyticsModel.getHiringTrend(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get resignation trend analytics
// @route   GET /api/analytics/resignation-trend
// @access  Private (HR/Admin)
const getResignationTrend = asyncHandler(async (req, res) => {
  const { period = 'month', year } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear()
  };

  const data = await AnalyticsModel.getResignationTrend(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get salary spending by department
// @route   GET /api/analytics/salary-spending
// @access  Private (HR/Admin)
const getSalarySpendingByDepartment = asyncHandler(async (req, res) => {
  const { period = 'month', year, month } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1
  };

  const data = await AnalyticsModel.getSalarySpendingByDepartment(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get payroll summary
// @route   GET /api/analytics/payroll-summary
// @access  Private (HR/Admin)
const getPayrollSummary = asyncHandler(async (req, res) => {
  const { period = 'month', year, month } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1
  };

  const data = await AnalyticsModel.getPayrollSummary(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get salary distribution
// @route   GET /api/analytics/salary-distribution
// @access  Private (HR/Admin)
const getSalaryDistribution = asyncHandler(async (req, res) => {
  const { department } = req.query;
  
  const filters = { department };
  const data = await AnalyticsModel.getSalaryDistribution(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get working hours by department
// @route   GET /api/analytics/working-hours/department
// @access  Private (HR/Admin)
const getWorkingHoursByDepartment = asyncHandler(async (req, res) => {
  const { period = 'month', year, month, department } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1,
    department
  };

  const data = await AnalyticsModel.getWorkingHoursByDepartment(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get working hours by employee
// @route   GET /api/analytics/working-hours/individual
// @access  Private (HR/Admin)
const getWorkingHoursByEmployee = asyncHandler(async (req, res) => {
  const { 
    period = 'month', 
    year, 
    month, 
    employee_id, 
    department,
    page = 1,
    limit = 10
  } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1,
    employee_id,
    department,
    page: parseInt(page),
    limit: parseInt(limit)
  };

  const data = await AnalyticsModel.getWorkingHoursByEmployee(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get working hours summary
// @route   GET /api/analytics/working-hours/summary
// @access  Private (HR/Admin)
const getWorkingHoursSummary = asyncHandler(async (req, res) => {
  const { period = 'month', year, month } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1
  };

  const data = await AnalyticsModel.getWorkingHoursSummary(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get employee overview
// @route   GET /api/analytics/employee-overview
// @access  Private (HR/Admin)
const getEmployeeOverview = asyncHandler(async (req, res) => {
  const { date } = req.query;
  
  const filters = {
    date: date || new Date().toISOString().split('T')[0]
  };

  const data = await AnalyticsModel.getEmployeeOverview(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get today's attendance
// @route   GET /api/analytics/attendance-today
// @access  Private (HR/Admin)
const getTodayAttendance = asyncHandler(async (req, res) => {
  const data = await AnalyticsModel.getTodayAttendance();
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get department statistics
// @route   GET /api/analytics/department-stats
// @access  Private (HR/Admin)
const getDepartmentStats = asyncHandler(async (req, res) => {
  const data = await AnalyticsModel.getDepartmentStats();
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get employee count
// @route   GET /api/analytics/employee-count
// @access  Private (HR/Admin)
const getEmployeeCount = asyncHandler(async (req, res) => {
  const { status = 'active', department } = req.query;
  
  const filters = { status, department };
  const data = await AnalyticsModel.getEmployeeCount(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get leaves summary
// @route   GET /api/analytics/leaves/summary
// @access  Private (HR/Admin)
const getLeavesSummary = asyncHandler(async (req, res) => {
  const { period = 'month', year, month, employee_id, department } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1,
    employee_id,
    department
  };

  const data = await AnalyticsModel.getLeavesSummary(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get available time periods
// @route   GET /api/reports/time-periods
// @access  Private (HR/Admin)
const getTimePeriods = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const data = {
    periods: ['month', 'year'],
    current_period: 'month',
    available_years: [currentYear - 2, currentYear - 1, currentYear, currentYear + 1],
    available_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    current_year: currentYear,
    current_month: currentMonth
  };
  
  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get current period settings
// @route   GET /api/reports/current-period
// @access  Private (HR/Admin)
const getCurrentPeriod = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const data = {
    period: 'month',
    year: currentYear,
    month: currentMonth,
    date_range: {
      start_date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`,
      end_date: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]
    }
  };
  
  res.status(200).json({
    success: true,
    data
  });
});

module.exports = {
  getHiringResignationData,
  getHiringTrend,
  getResignationTrend,
  getSalarySpendingByDepartment,
  getPayrollSummary,
  getSalaryDistribution,
  getWorkingHoursByDepartment,
  getWorkingHoursByEmployee,
  getWorkingHoursSummary,
  getEmployeeOverview,
  getTodayAttendance,
  getDepartmentStats,
  getEmployeeCount,
  getLeavesSummary,
  getTimePeriods,
  getCurrentPeriod
};