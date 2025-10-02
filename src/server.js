const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const config = require('./config');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const positionRoutes = require('./routes/positionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');

const app = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HR Dashboard API is running',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);

// API documentation route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HR Dashboard API',
    version: '1.0.0',
    documentation: {
      authentication: '/api/auth/*',
      employees: '/api/employees/*',
      departments: '/api/departments/*',
      positions: '/api/positions/*',
      attendance: '/api/attendance/*',
      leaves: '/api/leaves/*',
      analytics: '/api/analytics/*',
      reports: '/api/reports/*'
    },
    endpoints: {
      health: '/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password',
        logout: 'POST /api/auth/logout'
      },
      employees: {
        getAll: 'GET /api/employees',
        getOne: 'GET /api/employees/:id',
        create: 'POST /api/employees',
        update: 'PUT /api/employees/:id',
        delete: 'DELETE /api/employees/:id',
        byDepartment: 'GET /api/employees/department/:departmentId',
        byManager: 'GET /api/employees/manager/:managerId'
      },
      departments: {
        getAll: 'GET /api/departments',
        getOne: 'GET /api/departments/:id',
        create: 'POST /api/departments',
        update: 'PUT /api/departments/:id',
        delete: 'DELETE /api/departments/:id',
        budgetStats: 'GET /api/departments/:id/budget-stats'
      },
      positions: {
        getAll: 'GET /api/positions',
        getOne: 'GET /api/positions/:id',
        create: 'POST /api/positions',
        update: 'PUT /api/positions/:id',
        delete: 'DELETE /api/positions/:id',
        byDepartment: 'GET /api/positions/department/:departmentId',
        search: 'GET /api/positions/search?q=searchTerm',
        bySalaryRange: 'GET /api/positions/salary-range?min_salary=50000&max_salary=100000'
      },
      attendance: {
        getAll: 'GET /api/attendance',
        getOne: 'GET /api/attendance/:id',
        create: 'POST /api/attendance',
        update: 'PUT /api/attendance/:id',
        delete: 'DELETE /api/attendance/:id',
        checkIn: 'POST /api/attendance/checkin',
        checkOut: 'POST /api/attendance/checkout',
        summary: 'GET /api/attendance/summary/:employeeId'
      },
      leaves: {
        getAll: 'GET /api/leaves',
        create: 'POST /api/leaves',
        update: 'PUT /api/leaves/:id',
        cancel: 'DELETE /api/leaves/:id',
        updateStatus: 'PUT /api/leaves/:id/status',
        statistics: 'GET /api/leaves/statistics',
        balance: 'GET /api/leaves/balance/:employee_id',
        calendar: 'GET /api/leaves/calendar',
        types: 'GET /api/leaves/types',
        bulkAction: 'POST /api/leaves/bulk-action'
      },
      analytics: {
        hiringResignation: 'GET /api/analytics/hiring-resignation',
        salaryByDepartment: 'GET /api/analytics/salary-by-department',
        workingHoursByEmployee: 'GET /api/analytics/working-hours-by-employee',
        workingHoursByDepartment: 'GET /api/analytics/working-hours-by-department',
        employeeOverview: 'GET /api/analytics/employee-overview',
        salaryDistribution: 'GET /api/analytics/salary-distribution',
        employeeGrowth: 'GET /api/analytics/employee-growth',
        departmentStats: 'GET /api/analytics/department-stats',
        positionStats: 'GET /api/analytics/position-stats',
        ageDistribution: 'GET /api/analytics/age-distribution',
        tenureDistribution: 'GET /api/analytics/tenure-distribution',
        leavePatterns: 'GET /api/analytics/leave-patterns',
        attendancePatterns: 'GET /api/analytics/attendance-patterns',
        topPerformers: 'GET /api/analytics/top-performers',
        salaryBenchmarks: 'GET /api/analytics/salary-benchmarks'
      },
      reports: {
        detailedEmployee: 'GET /api/reports/detailed-employee',
        exportPDF: 'GET /api/reports/export/pdf',
        exportExcel: 'GET /api/reports/export/excel',
        exportCSV: 'GET /api/reports/export/csv'
      }
    }
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 HR Dashboard API Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;