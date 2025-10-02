const express = require('express');
const {
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
} = require('../controllers/leaveController');
const { authenticate, authorize, canAccessEmployee } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes for all authenticated users
router.get('/', getLeaveRequests);                          // Get leave requests with filtering
router.post('/', createLeaveRequest);                       // Create new leave request
router.get('/statistics', getLeaveStatistics);              // Get leave statistics
router.get('/calendar', getLeaveCalendar);                  // Get leave calendar
router.get('/types', getLeaveTypes);                        // Get all leave types

// Employee-specific routes (with access control)
router.get('/balance/:employee_id', canAccessEmployee, getEmployeeLeaveBalance); // Get employee leave balance

// Leave management routes (employees can manage their own, admin/hr/manager can manage all)
router.put('/:id', updateLeaveRequest);                     // Update leave request (only pending)
router.delete('/:id', cancelLeaveRequest);                  // Cancel leave request (only pending)

// Admin/HR/Manager only routes
router.put('/:id/status', authorize('admin', 'hr', 'manager'), updateLeaveStatus);     // Approve/reject leave
router.post('/bulk-action', authorize('admin', 'hr', 'manager'), bulkActionLeaves);    // Bulk approve/reject

module.exports = router;