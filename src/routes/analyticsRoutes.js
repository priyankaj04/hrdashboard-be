const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/analyticsController');

const { authenticate, authorize } = require('../middleware/auth');

// Apply authentication and authorization to all routes
router.use(authenticate);
router.use(authorize('admin', 'hr', 'manager'));

// Time period routes
router.get('/time-periods', getTimePeriods);
router.get('/current-period', getCurrentPeriod);

// HR Analytics routes
router.get('/hiring-resignation', getHiringResignationData);
router.get('/hiring-trend', getHiringTrend);
router.get('/resignation-trend', getResignationTrend);

// Salary Analytics routes
router.get('/salary-spending', getSalarySpendingByDepartment);
router.get('/payroll-summary', getPayrollSummary);
router.get('/salary-distribution', getSalaryDistribution);

// Working Hours Analytics routes
router.get('/working-hours/department', getWorkingHoursByDepartment);
router.get('/working-hours/individual', getWorkingHoursByEmployee);
router.get('/working-hours/summary', getWorkingHoursSummary);

// Employee Analytics routes
router.get('/employee-overview', getEmployeeOverview);
router.get('/attendance-today', getTodayAttendance);
router.get('/department-stats', getDepartmentStats);
router.get('/employee-count', getEmployeeCount);

// Leave Analytics routes
router.get('/leaves/summary', getLeavesSummary);

module.exports = router;