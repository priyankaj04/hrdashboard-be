const express = require('express');
const {
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
} = require('../controllers/attendanceController');
const { authenticate, authorize, canAccessEmployee } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Dashboard APIs - accessible by all authenticated users
router.get('/monthly', getMonthlyAttendance);           // Monthly attendance with summary
router.get('/daily', getDailyAttendance);               // Daily attendance with filtering
router.get('/analytics', getAttendanceAnalytics);       // Attendance analytics and trends
router.get('/employees', getEmployeesWithAttendance);   // Employee list with attendance summary
router.get('/departments', getDepartmentsWithStats);    // Department list with stats
router.get('/export', exportAttendanceData);            // Export attendance data (CSV/JSON)

// Check-in/out routes - employees can check themselves in/out
router.post('/check-in', checkIn);                      // Updated check-in endpoint
router.post('/check-out', checkOut);                    // Updated check-out endpoint

// Legacy routes - accessible by all authenticated users
router.get('/', getAttendanceRecords);
router.get('/summary/:employeeId', canAccessEmployee, getEmployeeSummary);
router.get('/department-summary/:departmentId', getDepartmentSummary);
router.get('/:id', getAttendanceRecord);                

// Routes for Admin/HR/Manager
router.post('/', authorize('admin', 'hr', 'manager'), createAttendanceRecord);
router.put('/:id', authorize('admin', 'hr', 'manager'), updateAttendanceRecord);

// Admin/HR only routes
router.delete('/:id', authorize('admin', 'hr'), deleteAttendanceRecord);

module.exports = router;