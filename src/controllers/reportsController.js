const asyncHandler = require('../middleware/asyncHandler');
const ReportsModel = require('../models/ReportsModel');
const { ApiError } = require('../utils/apiError');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// @desc    Get detailed employee report
// @route   GET /api/reports/employee-detailed
// @access  Private (HR/Admin)
const getDetailedEmployeeReport = asyncHandler(async (req, res) => {
  const {
    department,
    employee_id,
    period = 'month',
    year,
    month,
    sort_by = 'employee_name',
    sort_order = 'asc',
    page = 1,
    limit = 30
  } = req.query;

  const filters = {
    department: department && department !== 'all' ? department : null,
    employee_id,
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1,
    sort_by,
    sort_order,
    page: parseInt(page),
    limit: parseInt(limit)
  };

  const data = await ReportsModel.getDetailedEmployeeReport(filters);

  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Export report in various formats
// @route   GET /api/reports/export
// @access  Private (HR/Admin)
const exportReport = asyncHandler(async (req, res) => {
  const {
    type,
    format = 'pdf',
    department,
    employee_id,
    period = 'month',
    year,
    month,
    sort_by = 'employee_name',
    sort_order = 'asc'
  } = req.query;

  if (!type) {
    throw new ApiError(400, 'Report type is required');
  }

  const filters = {
    department: department && department !== 'all' ? department : null,
    employee_id,
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1,
    sort_by,
    sort_order,
    page: 1,
    limit: 1000 // Get all data for export
  };

  let reportData;
  let filename;
  
  switch (type) {
    case 'employee-detailed':
      reportData = await ReportsModel.getDetailedEmployeeReport(filters);
      filename = `employee-detailed-report-${filters.year}-${filters.month}`;
      break;
    case 'salary-spending':
      reportData = await ReportsModel.getSalarySpendingReport(filters);
      filename = `salary-spending-report-${filters.year}-${filters.month}`;
      break;
    case 'working-hours':
      reportData = await ReportsModel.getWorkingHoursReport(filters);
      filename = `working-hours-report-${filters.year}-${filters.month}`;
      break;
    default:
      throw new ApiError(400, 'Invalid report type');
  }

  switch (format.toLowerCase()) {
    case 'pdf':
      await generatePDFReport(res, reportData, filename, type);
      break;
    case 'csv':
      await generateCSVReport(res, reportData, filename, type);
      break;
    case 'excel':
      await generateExcelReport(res, reportData, filename, type);
      break;
    default:
      throw new ApiError(400, 'Invalid export format. Supported formats: pdf, csv, excel');
  }
});

// Helper function to generate PDF report
const generatePDFReport = async (res, data, filename, reportType) => {
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
  
  doc.pipe(res);
  
  // Header
  doc.fontSize(20).text('HR Dashboard Report', 50, 50);
  doc.fontSize(16).text(`Report Type: ${reportType.replace('-', ' ').toUpperCase()}`, 50, 80);
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 100);
  
  let yPosition = 140;
  
  if (reportType === 'employee-detailed') {
    // Table headers
    doc.fontSize(10)
       .text('Employee Name', 50, yPosition)
       .text('Department', 150, yPosition)
       .text('Position', 230, yPosition)
       .text('Salary', 310, yPosition)
       .text('Leaves', 370, yPosition)
       .text('Hours', 420, yPosition)
       .text('Attendance', 470, yPosition);
    
    yPosition += 20;
    
    // Table data
    data.data.forEach(employee => {
      if (yPosition > 750) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.text(employee.employee_name, 50, yPosition)
         .text(employee.department, 150, yPosition)
         .text(employee.position, 230, yPosition)
         .text(`$${employee.monthly_salary}`, 310, yPosition)
         .text(employee.total_leaves_taken.toString(), 370, yPosition)
         .text(employee.average_working_hours.toString(), 420, yPosition)
         .text(`${employee.attendance_rate}%`, 470, yPosition);
      
      yPosition += 15;
    });
  }
  
  doc.end();
};

// Helper function to generate CSV report
const generateCSVReport = async (res, data, filename, reportType) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
  
  let csvContent = '';
  
  if (reportType === 'employee-detailed') {
    // CSV Headers
    csvContent = 'Employee Name,Department,Position,Monthly Salary,Total Leaves Taken,Average Working Hours,Overtime Hours,Attendance Rate\n';
    
    // CSV Data
    data.data.forEach(employee => {
      csvContent += `"${employee.employee_name}","${employee.department}","${employee.position}",${employee.monthly_salary},${employee.total_leaves_taken},${employee.average_working_hours},${employee.overtime_hours},${employee.attendance_rate}\n`;
    });
  }
  
  res.send(csvContent);
};

// Helper function to generate Excel report
const generateExcelReport = async (res, data, filename, reportType) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');
  
  if (reportType === 'employee-detailed') {
    // Define columns
    worksheet.columns = [
      { header: 'Employee Name', key: 'employee_name', width: 20 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Position', key: 'position', width: 20 },
      { header: 'Monthly Salary', key: 'monthly_salary', width: 15 },
      { header: 'Total Leaves Taken', key: 'total_leaves_taken', width: 18 },
      { header: 'Average Working Hours', key: 'average_working_hours', width: 20 },
      { header: 'Overtime Hours', key: 'overtime_hours', width: 15 },
      { header: 'Attendance Rate', key: 'attendance_rate', width: 15 }
    ];
    
    // Add data
    data.data.forEach(employee => {
      worksheet.addRow(employee);
    });
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  }
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
  
  await workbook.xlsx.write(res);
  res.end();
};

// @desc    Get report summary statistics
// @route   GET /api/reports/summary
// @access  Private (HR/Admin)
const getReportSummary = asyncHandler(async (req, res) => {
  const { period = 'month', year, month } = req.query;
  
  const filters = {
    period,
    year: year ? parseInt(year) : new Date().getFullYear(),
    month: month ? parseInt(month) : new Date().getMonth() + 1
  };

  const data = await ReportsModel.getReportSummary(filters);
  
  res.status(200).json({
    success: true,
    data
  });
});

module.exports = {
  getDetailedEmployeeReport,
  exportReport,
  getReportSummary
};