const BaseModel = require('./BaseModel');

class ReportsModel extends BaseModel {
  constructor() {
    super('employees');
  }

  // Get detailed employee report
  async getDetailedEmployeeReport(filters) {
    const { 
      department, 
      employee_id, 
      period, 
      year, 
      month, 
      sort_by, 
      sort_order, 
      page, 
      limit 
    } = filters;
    
    const offset = (page - 1) * limit;
    
    let startDate, endDate;
    if (period === 'year') {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      endDate = new Date(year, month, 0).toISOString().split('T')[0];
    }

    // Base query for employees
    let query = this.supabase
      .from('employees')
      .select(`
        id,
        employee_id,
        first_name,
        last_name,
        salary,
        employment_status,
        department:departments(id, name),
        position:positions(id, title)
      `, { count: 'exact' })
      .eq('employment_status', 'active');

    if (department) {
      query = query.eq('department.name', department);
    }

    if (employee_id) {
      query = query.eq('id', employee_id);
    }

    const { data: employees, error: empError, count } = await query;
    if (empError) throw new Error(`Error fetching employees: ${empError.message}`);

    // Get additional data for each employee
    const detailedEmployees = await Promise.all(
      employees.map(async (employee) => {
        // Get leave data
        const { data: leaves } = await this.supabase
          .from('leave_requests')
          .select('total_days, status')
          .eq('employee_id', employee.id)
          .gte('start_date', startDate)
          .lte('end_date', endDate);

        // Get attendance data
        const { data: attendance } = await this.supabase
          .from('attendance')
          .select('hours_worked, overtime_hours, status')
          .eq('employee_id', employee.id)
          .gte('date', startDate)
          .lte('date', endDate);

        // Calculate metrics
        const totalLeavesApproved = leaves
          ?.filter(l => l.status === 'approved')
          .reduce((sum, l) => sum + (parseFloat(l.total_days) || 0), 0) || 0;

        const totalLeavesPending = leaves
          ?.filter(l => l.status === 'pending')
          .reduce((sum, l) => sum + (parseFloat(l.total_days) || 0), 0) || 0;

        const totalWorkingHours = attendance
          ?.reduce((sum, a) => sum + (parseFloat(a.hours_worked) || 0), 0) || 0;

        const totalOvertimeHours = attendance
          ?.reduce((sum, a) => sum + (parseFloat(a.overtime_hours) || 0), 0) || 0;

        const totalWorkingDays = attendance?.length || 0;
        const presentDays = attendance?.filter(a => a.status === 'present').length || 0;
        const attendanceRate = totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0;

        return {
          employee_id: employee.id,
          employee_name: `${employee.first_name} ${employee.last_name}`,
          department: employee.department?.name || 'Unknown',
          position: employee.position?.title || 'Unknown',
          monthly_salary: parseFloat(employee.salary) || 0,
          total_leaves_taken: totalLeavesApproved,
          total_leaves_pending: totalLeavesPending,
          average_working_hours: totalWorkingDays > 0 ? totalWorkingHours / totalWorkingDays : 0,
          total_working_hours: totalWorkingHours,
          overtime_hours: totalOvertimeHours,
          attendance_rate: parseFloat(attendanceRate.toFixed(1)),
          working_days: totalWorkingDays,
          present_days: presentDays
        };
      })
    );

    // Sort the results
    const sortField = sort_by || 'employee_name';
    const sortDirection = sort_order === 'desc' ? -1 : 1;

    detailedEmployees.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle string sorting
      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue) * sortDirection;
      }

      // Handle number sorting
      return (aValue - bValue) * sortDirection;
    });

    // Apply pagination
    const paginatedData = detailedEmployees.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(detailedEmployees.length / limit),
        total_records: detailedEmployees.length,
        per_page: limit
      },
      filters: {
        period,
        year,
        month: period === 'month' ? month : null,
        department,
        employee_id
      }
    };
  }

  // Get salary spending report
  async getSalarySpendingReport(filters) {
    const { period, year, month } = filters;

    const { data, error } = await this.supabase
      .from('employees')
      .select(`
        id,
        first_name,
        last_name,
        salary,
        employment_status,
        department:departments(id, name),
        position:positions(id, title)
      `)
      .eq('employment_status', 'active');

    if (error) throw new Error(`Error fetching salary spending report: ${error.message}`);

    const reportData = data.map(employee => ({
      employee_id: employee.id,
      employee_name: `${employee.first_name} ${employee.last_name}`,
      department: employee.department?.name || 'Unknown',
      position: employee.position?.title || 'Unknown',
      monthly_salary: parseFloat(employee.salary) || 0,
      annual_salary: (parseFloat(employee.salary) || 0) * 12
    }));

    // Calculate totals by department
    const departmentTotals = {};
    reportData.forEach(emp => {
      if (!departmentTotals[emp.department]) {
        departmentTotals[emp.department] = {
          department: emp.department,
          employee_count: 0,
          total_monthly: 0,
          total_annual: 0,
          average_salary: 0
        };
      }
      departmentTotals[emp.department].employee_count += 1;
      departmentTotals[emp.department].total_monthly += emp.monthly_salary;
      departmentTotals[emp.department].total_annual += emp.annual_salary;
    });

    // Calculate averages
    Object.keys(departmentTotals).forEach(dept => {
      const d = departmentTotals[dept];
      d.average_salary = d.employee_count > 0 ? d.total_monthly / d.employee_count : 0;
    });

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      data: reportData,
      department_summary: Object.values(departmentTotals),
      grand_total: {
        total_employees: reportData.length,
        total_monthly_spending: reportData.reduce((sum, emp) => sum + emp.monthly_salary, 0),
        total_annual_spending: reportData.reduce((sum, emp) => sum + emp.annual_salary, 0),
        average_salary: reportData.length > 0 
          ? reportData.reduce((sum, emp) => sum + emp.monthly_salary, 0) / reportData.length 
          : 0
      }
    };
  }

  // Get working hours report
  async getWorkingHoursReport(filters) {
    const { period, year, month } = filters;
    
    let startDate, endDate;
    if (period === 'year') {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      endDate = new Date(year, month, 0).toISOString().split('T')[0];
    }

    // Get all employees
    const { data: employees, error: empError } = await this.supabase
      .from('employees')
      .select(`
        id,
        first_name,
        last_name,
        department:departments(name),
        position:positions(title)
      `)
      .eq('employment_status', 'active');

    if (empError) throw new Error(`Error fetching employees: ${empError.message}`);

    // Get attendance data for the period
    const reportData = await Promise.all(
      employees.map(async (employee) => {
        const { data: attendance } = await this.supabase
          .from('attendance')
          .select('date, hours_worked, overtime_hours, status')
          .eq('employee_id', employee.id)
          .gte('date', startDate)
          .lte('date', endDate);

        const totalHours = attendance?.reduce((sum, a) => sum + (parseFloat(a.hours_worked) || 0), 0) || 0;
        const totalOvertime = attendance?.reduce((sum, a) => sum + (parseFloat(a.overtime_hours) || 0), 0) || 0;
        const workingDays = attendance?.length || 0;
        const presentDays = attendance?.filter(a => a.status === 'present').length || 0;

        return {
          employee_id: employee.id,
          employee_name: `${employee.first_name} ${employee.last_name}`,
          department: employee.department?.name || 'Unknown',
          position: employee.position?.title || 'Unknown',
          total_hours: totalHours,
          overtime_hours: totalOvertime,
          working_days: workingDays,
          present_days: presentDays,
          average_daily_hours: presentDays > 0 ? totalHours / presentDays : 0,
          attendance_rate: workingDays > 0 ? (presentDays / workingDays) * 100 : 0
        };
      })
    );

    // Calculate department summaries
    const departmentSummary = {};
    reportData.forEach(emp => {
      if (!departmentSummary[emp.department]) {
        departmentSummary[emp.department] = {
          department: emp.department,
          employee_count: 0,
          total_hours: 0,
          total_overtime: 0,
          average_hours: 0
        };
      }
      departmentSummary[emp.department].employee_count += 1;
      departmentSummary[emp.department].total_hours += emp.total_hours;
      departmentSummary[emp.department].total_overtime += emp.overtime_hours;
    });

    // Calculate department averages
    Object.keys(departmentSummary).forEach(dept => {
      const d = departmentSummary[dept];
      d.average_hours = d.employee_count > 0 ? d.total_hours / d.employee_count : 0;
    });

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      data: reportData,
      department_summary: Object.values(departmentSummary),
      summary: {
        total_employees: reportData.length,
        total_hours: reportData.reduce((sum, emp) => sum + emp.total_hours, 0),
        total_overtime: reportData.reduce((sum, emp) => sum + emp.overtime_hours, 0),
        average_hours_per_employee: reportData.length > 0 
          ? reportData.reduce((sum, emp) => sum + emp.total_hours, 0) / reportData.length 
          : 0
      }
    };
  }

  // Get report summary
  async getReportSummary(filters) {
    const { period, year, month } = filters;
    
    let startDate, endDate;
    if (period === 'year') {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      endDate = new Date(year, month, 0).toISOString().split('T')[0];
    }

    // Get basic counts
    const [
      { count: totalEmployees },
      { count: totalDepartments },
      { data: leaveRequests },
      { data: attendanceRecords }
    ] = await Promise.all([
      this.supabase.from('employees').select('*', { count: 'exact', head: true }).eq('employment_status', 'active'),
      this.supabase.from('departments').select('*', { count: 'exact', head: true }),
      this.supabase.from('leave_requests').select('status, total_days').gte('start_date', startDate).lte('end_date', endDate),
      this.supabase.from('attendance').select('status, hours_worked').gte('date', startDate).lte('date', endDate)
    ]);

    // Calculate leave statistics
    const leaveStats = {
      total_requests: leaveRequests?.length || 0,
      approved: leaveRequests?.filter(l => l.status === 'approved').length || 0,
      pending: leaveRequests?.filter(l => l.status === 'pending').length || 0,
      rejected: leaveRequests?.filter(l => l.status === 'rejected').length || 0,
      total_days: leaveRequests?.reduce((sum, l) => sum + (parseFloat(l.total_days) || 0), 0) || 0
    };

    // Calculate attendance statistics
    const attendanceStats = {
      total_records: attendanceRecords?.length || 0,
      present: attendanceRecords?.filter(a => a.status === 'present').length || 0,
      absent: attendanceRecords?.filter(a => a.status === 'absent').length || 0,
      late: attendanceRecords?.filter(a => a.status === 'late').length || 0,
      total_hours: attendanceRecords?.reduce((sum, a) => sum + (parseFloat(a.hours_worked) || 0), 0) || 0
    };

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      date_range: { start_date: startDate, end_date: endDate },
      overview: {
        total_employees: totalEmployees || 0,
        total_departments: totalDepartments || 0,
        report_generated_at: new Date().toISOString()
      },
      leave_statistics: leaveStats,
      attendance_statistics: attendanceStats
    };
  }
}

module.exports = new ReportsModel();