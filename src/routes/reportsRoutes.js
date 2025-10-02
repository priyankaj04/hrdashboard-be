const express = require('express');
const router = express.Router();
const {
  getDetailedEmployeeReport,
  exportReport,
  getReportSummary
} = require('../controllers/reportsController');

const { authenticate, authorize } = require('../middleware/auth');

// Apply authentication and authorization to all routes
router.use(authenticate);
router.use(authorize('admin', 'hr', 'manager'));

// Detailed Reports routes
router.get('/employee-detailed', getDetailedEmployeeReport);
router.get('/summary', getReportSummary);

// Export routes
router.get('/export', exportReport);

module.exports = router;