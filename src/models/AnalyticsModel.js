const BaseModel = require('./BaseModel');

class AnalyticsModel extends BaseModel {
  constructor() {
    super('employees');
  }

  // Get hiring and resignation data
  async getHiringResignationData(filters) {
    const { period, year, month, department } = filters;
    
    let startDate, endDate;
    if (period === 'year') {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      endDate = new Date(year, month, 0).toISOString().split('T')[0];
    }

    // Get hirings (employees hired in the period)
    let hiringQuery = this.supabase
      .from('employees')
      .select('id, hire_date, department:departments(name)')
      .gte('hire_date', startDate)
      .lte('hire_date', endDate)
      .eq('employment_status', 'active');

    if (department) {
      hiringQuery = hiringQuery.eq('department.name', department);
    }

    const { data: hirings, error: hiringError } = await hiringQuery;
    if (hiringError) throw new Error(`Error fetching hiring data: ${hiringError.message}`);

    // Get resignations (employees terminated in the period)
    let resignationQuery = this.supabase
      .from('employees')
      .select('id, termination_date, department:departments(name)')
      .gte('termination_date', startDate)
      .lte('termination_date', endDate)
      .eq('employment_status', 'inactive');

    if (department) {
      resignationQuery = resignationQuery.eq('department.name', department);
    }

    const { data: resignations, error: resignationError } = await resignationQuery;
    if (resignationError) throw new Error(`Error fetching resignation data: ${resignationError.message}`);

    const totalHirings = hirings?.length || 0;
    const totalResignations = resignations?.length || 0;
    const netChange = totalHirings - totalResignations;

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      total_hirings: totalHirings,
      total_resignations: totalResignations,
      net_change: netChange,
      hiring_data: hirings || [],
      resignation_data: resignations || []
    };
  }

  // Get hiring trend
  async getHiringTrend(filters) {
    const { period, year } = filters;
    const trendData = [];

    if (period === 'year') {
      // Get yearly trend for the last 5 years
      for (let y = year - 4; y <= year; y++) {
        const { data, error } = await this.supabase
          .from('employees')
          .select('id')
          .gte('hire_date', `${y}-01-01`)
          .lte('hire_date', `${y}-12-31`)
          .eq('employment_status', 'active');

        if (!error) {
          trendData.push({
            period: y.toString(),
            hirings: data?.length || 0
          });
        }
      }
    } else {
      // Get monthly trend for the current year
      for (let m = 1; m <= 12; m++) {
        const startDate = `${year}-${m.toString().padStart(2, '0')}-01`;
        const endDate = new Date(year, m, 0).toISOString().split('T')[0];

        const { data, error } = await this.supabase
          .from('employees')
          .select('id')
          .gte('hire_date', startDate)
          .lte('hire_date', endDate)
          .eq('employment_status', 'active');

        if (!error) {
          trendData.push({
            period: `${year}-${m.toString().padStart(2, '0')}`,
            hirings: data?.length || 0
          });
        }
      }
    }

    return {
      period,
      year,
      trend_data: trendData
    };
  }

  // Get resignation trend
  async getResignationTrend(filters) {
    const { period, year } = filters;
    const trendData = [];

    if (period === 'year') {
      // Get yearly trend for the last 5 years
      for (let y = year - 4; y <= year; y++) {
        const { data, error } = await this.supabase
          .from('employees')
          .select('id')
          .gte('termination_date', `${y}-01-01`)
          .lte('termination_date', `${y}-12-31`)
          .eq('employment_status', 'inactive');

        if (!error) {
          trendData.push({
            period: y.toString(),
            resignations: data?.length || 0
          });
        }
      }
    } else {
      // Get monthly trend for the current year
      for (let m = 1; m <= 12; m++) {
        const startDate = `${year}-${m.toString().padStart(2, '0')}-01`;
        const endDate = new Date(year, m, 0).toISOString().split('T')[0];

        const { data, error } = await this.supabase
          .from('employees')
          .select('id')
          .gte('termination_date', startDate)
          .lte('termination_date', endDate)
          .eq('employment_status', 'inactive');

        if (!error) {
          trendData.push({
            period: `${year}-${m.toString().padStart(2, '0')}`,
            resignations: data?.length || 0
          });
        }
      }
    }

    return {
      period,
      year,
      trend_data: trendData
    };
  }

  // Get salary spending by department
  async getSalarySpendingByDepartment(filters) {
    const { period, year, month } = filters;

    const { data, error } = await this.supabase
      .from('employees')
      .select(`
        salary,
        department:departments(id, name),
        employment_status
      `)
      .eq('employment_status', 'active');

    if (error) throw new Error(`Error fetching salary data: ${error.message}`);

    const departmentSpending = {};
    let totalSpending = 0;

    data.forEach(employee => {
      const deptName = employee.department?.name || 'Unknown';
      if (!departmentSpending[deptName]) {
        departmentSpending[deptName] = {
          department: deptName,
          total_spending: 0,
          employee_count: 0,
          average_salary: 0
        };
      }

      const salary = parseFloat(employee.salary) || 0;
      departmentSpending[deptName].total_spending += salary;
      departmentSpending[deptName].employee_count += 1;
      totalSpending += salary;
    });

    // Calculate average salaries
    Object.keys(departmentSpending).forEach(dept => {
      const spending = departmentSpending[dept];
      spending.average_salary = spending.employee_count > 0 
        ? spending.total_spending / spending.employee_count 
        : 0;
    });

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      total_spending: totalSpending,
      departments: Object.values(departmentSpending)
    };
  }

  // Get payroll summary
  async getPayrollSummary(filters) {
    const { period, year, month } = filters;

    const { data, error } = await this.supabase
      .from('employees')
      .select(`
        salary,
        salary_type,
        employment_status,
        department:departments(name)
      `)
      .eq('employment_status', 'active');

    if (error) throw new Error(`Error fetching payroll data: ${error.message}`);

    let totalSalary = 0;
    let totalEmployees = data.length;
    const salaryRanges = {
      '0-30000': 0,
      '30001-60000': 0,
      '60001-100000': 0,
      '100000+': 0
    };

    data.forEach(employee => {
      const salary = parseFloat(employee.salary) || 0;
      totalSalary += salary;

      // Categorize salary ranges
      if (salary <= 30000) {
        salaryRanges['0-30000']++;
      } else if (salary <= 60000) {
        salaryRanges['30001-60000']++;
      } else if (salary <= 100000) {
        salaryRanges['60001-100000']++;
      } else {
        salaryRanges['100000+']++;
      }
    });

    const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      total_payroll: totalSalary,
      total_employees: totalEmployees,
      average_salary: averageSalary,
      salary_ranges: salaryRanges
    };
  }

  // Get salary distribution
  async getSalaryDistribution(filters) {
    const { department } = filters;

    let query = this.supabase
      .from('employees')
      .select(`
        salary,
        department:departments(name),
        position:positions(title)
      `)
      .eq('employment_status', 'active');

    if (department) {
      query = query.eq('department.name', department);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error fetching salary distribution: ${error.message}`);

    const distribution = {
      by_department: {},
      by_position: {},
      salary_ranges: {
        '0-30000': { count: 0, percentage: 0 },
        '30001-60000': { count: 0, percentage: 0 },
        '60001-100000': { count: 0, percentage: 0 },
        '100000+': { count: 0, percentage: 0 }
      }
    };

    data.forEach(employee => {
      const salary = parseFloat(employee.salary) || 0;
      const dept = employee.department?.name || 'Unknown';
      const position = employee.position?.title || 'Unknown';

      // By department
      if (!distribution.by_department[dept]) {
        distribution.by_department[dept] = { total: 0, count: 0, average: 0 };
      }
      distribution.by_department[dept].total += salary;
      distribution.by_department[dept].count += 1;

      // By position
      if (!distribution.by_position[position]) {
        distribution.by_position[position] = { total: 0, count: 0, average: 0 };
      }
      distribution.by_position[position].total += salary;
      distribution.by_position[position].count += 1;

      // Salary ranges
      if (salary <= 30000) {
        distribution.salary_ranges['0-30000'].count++;
      } else if (salary <= 60000) {
        distribution.salary_ranges['30001-60000'].count++;
      } else if (salary <= 100000) {
        distribution.salary_ranges['60001-100000'].count++;
      } else {
        distribution.salary_ranges['100000+'].count++;
      }
    });

    // Calculate averages and percentages
    Object.keys(distribution.by_department).forEach(dept => {
      const d = distribution.by_department[dept];
      d.average = d.count > 0 ? d.total / d.count : 0;
    });

    Object.keys(distribution.by_position).forEach(pos => {
      const p = distribution.by_position[pos];
      p.average = p.count > 0 ? p.total / p.count : 0;
    });

    const totalEmployees = data.length;
    Object.keys(distribution.salary_ranges).forEach(range => {
      const r = distribution.salary_ranges[range];
      r.percentage = totalEmployees > 0 ? (r.count / totalEmployees) * 100 : 0;
    });

    return distribution;
  }

  // Get working hours by department
async getWorkingHoursByDepartment(filters) {
    const { period, year, month, department } = filters;
    
    let startDate, endDate;
    if (period === 'year') {
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
    } else {
        startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        endDate = new Date(year, month, 0).toISOString().split('T')[0];
    }

    let query = this.supabase
        .from('attendance_records')
        .select(`
            employee_id,
            check_in,
            check_out,
            employee:employees!inner(
                department:departments(name)
            )
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .not('check_in', 'is', null)
        .not('check_out', 'is', null);

    if (department) {
        query = query.eq('employee.department.name', department);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error fetching working hours: ${error.message}`);

    const departmentHours = {};

    data.forEach(record => {
        const dept = record.employee?.department?.name || 'Unknown';
        if (!departmentHours[dept]) {
            departmentHours[dept] = {
                department: dept,
                total_hours: 0,
                total_overtime: 0,
                employee_count: new Set(),
                average_hours: 0
            };
        }

        // Calculate hours worked from check_in and check_out
        if (!record.check_in || !record.check_out) {
            return; // Skip records with missing check-in or check-out times
        }

        // Ensure time format is correct (HH:MM or HH:MM:SS)
        const formatTime = (time) => {
            if (typeof time !== 'string') return null;
            const timeParts = time.split(':');
            if (timeParts.length >= 2) {
                return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
            }
            return null;
        };

        const formattedCheckIn = formatTime(record.check_in);
        const formattedCheckOut = formatTime(record.check_out);

        if (!formattedCheckIn || !formattedCheckOut) {
            return; // Skip records with invalid time format
        }

        const checkIn = new Date(`1970-01-01T${formattedCheckIn}`);
        const checkOut = new Date(`1970-01-01T${formattedCheckOut}`);

        // Validate dates
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return; // Skip records with invalid dates
        }

        const hoursWorked = (checkOut - checkIn) / (1000 * 60 * 60); // Convert ms to hours
        
        // Calculate overtime (assuming 8 hours is standard work day)
        const standardHours = 8;
        const overtime = Math.max(0, hoursWorked - standardHours);

        departmentHours[dept].total_hours += hoursWorked || 0;
        departmentHours[dept].total_overtime += overtime || 0;
        departmentHours[dept].employee_count.add(record.employee_id);
    });

    // Convert Set to count and calculate averages
    const result = Object.values(departmentHours).map(dept => ({
        ...dept,
        employee_count: dept.employee_count.size,
        average_hours: dept.employee_count.size > 0 ? dept.total_hours / dept.employee_count.size : 0
    }));

    return {
        period,
        year,
        month: period === 'month' ? month : null,
        department_summary: result
    };
}

  // Get working hours by employee (with pagination)
  async getWorkingHoursByEmployee(filters) {
    const { period, year, month, employee_id, department, page, limit } = filters;
    const offset = (page - 1) * limit;
    
    let startDate, endDate;
    if (period === 'year') {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      endDate = new Date(year, month, 0).toISOString().split('T')[0];
    }

    let query = this.supabase
      .from('attendance')
      .select(`
        employee_id,
        hours_worked,
        overtime_hours,
        employee:employees!inner(
          id,
          first_name,
          last_name,
          department:departments(name)
        )
      `, { count: 'exact' })
      .gte('date', startDate)
      .lte('date', endDate);

    if (employee_id) {
      query = query.eq('employee_id', employee_id);
    }

    if (department) {
      query = query.eq('employee.department.name', department);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Error fetching employee working hours: ${error.message}`);

    // Group by employee
    const employeeHours = {};

    data.forEach(record => {
      const empId = record.employee_id;
      if (!employeeHours[empId]) {
        employeeHours[empId] = {
          employee_id: empId,
          employee_name: `${record.employee.first_name} ${record.employee.last_name}`,
          department: record.employee.department?.name || 'Unknown',
          total_hours: 0,
          overtime_hours: 0,
          days_worked: 0,
          average_daily_hours: 0
        };
      }

      employeeHours[empId].total_hours += parseFloat(record.hours_worked) || 0;
      employeeHours[empId].overtime_hours += parseFloat(record.overtime_hours) || 0;
      employeeHours[empId].days_worked += 1;
    });

    // Calculate averages
    const result = Object.values(employeeHours).map(emp => ({
      ...emp,
      average_daily_hours: emp.days_worked > 0 ? emp.total_hours / emp.days_worked : 0
    }));

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      individual_data: result,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(count / limit),
        total_records: count,
        per_page: limit
      }
    };
  }

  // Get working hours summary
  async getWorkingHoursSummary(filters) {
    const { period, year, month } = filters;
    
    let startDate, endDate;
    if (period === 'year') {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      endDate = new Date(year, month, 0).toISOString().split('T')[0];
    }

    const { data, error } = await this.supabase
      .from('attendance')
      .select('hours_worked, overtime_hours, employee_id')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw new Error(`Error fetching working hours summary: ${error.message}`);

    let totalHours = 0;
    let totalOvertime = 0;
    const uniqueEmployees = new Set();

    data.forEach(record => {
      totalHours += parseFloat(record.hours_worked) || 0;
      totalOvertime += parseFloat(record.overtime_hours) || 0;
      uniqueEmployees.add(record.employee_id);
    });

    const employeeCount = uniqueEmployees.size;
    const averageHours = employeeCount > 0 ? totalHours / employeeCount : 0;

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      total_hours: totalHours,
      total_overtime: totalOvertime,
      employee_count: employeeCount,
      average_hours_per_employee: averageHours
    };
  }

  // Get employee overview
  async getEmployeeOverview(filters) {
    const { date } = filters;
    const today = date || new Date().toISOString().split('T')[0];

    // Get total employees
    const { data: allEmployees, error: empError } = await this.supabase
      .from('employees')
      .select('id, department:departments(name)')
      .eq('employment_status', 'active');

    if (empError) throw new Error(`Error fetching employees: ${empError.message}`);

    // Get today's attendance
    const { data: attendance, error: attError } = await this.supabase
      .from('attendance_records')
      .select(`
        employee_id,
        status,
        employee:employees!inner(
          department:departments(name)
        )
      `)
      .eq('date', today);

    if (attError) throw new Error(`Error fetching attendance: ${attError.message}`);

    const totalEmployees = allEmployees.length;
    const presentToday = attendance.filter(a => a.status === 'present').length;
    const absentToday = totalEmployees - presentToday;
    const attendanceRate = totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0;

    // Department stats
    const deptStats = {};
    allEmployees.forEach(emp => {
      const dept = emp.department?.name || 'Unknown';
      if (!deptStats[dept]) {
        deptStats[dept] = { total: 0, present: 0, absent: 0 };
      }
      deptStats[dept].total += 1;
    });

    attendance.forEach(att => {
      const dept = att.employee?.department?.name || 'Unknown';
      if (deptStats[dept] && att.status === 'present') {
        deptStats[dept].present += 1;
      }
    });

    // Calculate absent counts
    Object.keys(deptStats).forEach(dept => {
      deptStats[dept].absent = deptStats[dept].total - deptStats[dept].present;
    });

    return {
      total_employees: totalEmployees,
      present_today: presentToday,
      absent_today: absentToday,
      total_departments: Object.keys(deptStats).length,
      attendance_rate: parseFloat(attendanceRate.toFixed(1)),
      department_stats: Object.keys(deptStats).map(dept => ({
        department: dept,
        ...deptStats[dept]
      }))
    };
  }

  // Get today's attendance
  async getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from('attendance')
      .select(`
        employee_id,
        status,
        clock_in,
        clock_out,
        employee:employees!inner(
          first_name,
          last_name,
          department:departments(name)
        )
      `)
      .eq('date', today);

    if (error) throw new Error(`Error fetching today's attendance: ${error.message}`);

    const present = data.filter(a => a.status === 'present');
    const absent = data.filter(a => a.status === 'absent');
    const late = data.filter(a => a.status === 'late');

    return {
      date: today,
      total_records: data.length,
      present: present.length,
      absent: absent.length,
      late: late.length,
      attendance_details: data.map(att => ({
        employee_id: att.employee_id,
        employee_name: `${att.employee.first_name} ${att.employee.last_name}`,
        department: att.employee.department?.name,
        status: att.status,
        clock_in: att.clock_in,
        clock_out: att.clock_out
      }))
    };
  }

  // Get department statistics
  async getDepartmentStats() {
    const { data, error } = await this.supabase
      .from('departments')
      .select(`
        id,
        name,
        employees!inner(id, employment_status)
      `);

    if (error) throw new Error(`Error fetching department stats: ${error.message}`);

    const stats = data.map(dept => {
      const activeEmployees = dept.employees.filter(emp => emp.employment_status === 'active').length;
      const inactiveEmployees = dept.employees.filter(emp => emp.employment_status === 'inactive').length;
      
      return {
        department_id: dept.id,
        department_name: dept.name,
        total_employees: dept.employees.length,
        active_employees: activeEmployees,
        inactive_employees: inactiveEmployees
      };
    });

    return {
      departments: stats,
      total_departments: stats.length,
      total_employees: stats.reduce((sum, dept) => sum + dept.total_employees, 0)
    };
  }

  // Get employee count
  async getEmployeeCount(filters) {
    const { status, department } = filters;

    let query = this.supabase
      .from('employees')
      .select('id, department:departments(name)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('employment_status', status);
    }

    if (department) {
      query = query.eq('department.name', department);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(`Error fetching employee count: ${error.message}`);

    return {
      total_count: count,
      status_filter: status,
      department_filter: department,
      employees: data || []
    };
  }

  // Get leaves summary
  async getLeavesSummary(filters) {
    const { period, year, month, employee_id, department } = filters;
    
    let startDate, endDate;
    if (period === 'year') {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      endDate = new Date(year, month, 0).toISOString().split('T')[0];
    }

    let query = this.supabase
      .from('leave_requests')
      .select(`
        id,
        employee_id,
        leave_type_id,
        total_days,
        status,
        start_date,
        end_date,
        employee:employees!inner(
          first_name,
          last_name,
          department:departments(name)
        ),
        leave_type:leave_types(name, color)
      `)
      .gte('start_date', startDate)
      .lte('end_date', endDate);

    if (employee_id) {
      query = query.eq('employee_id', employee_id);
    }

    if (department) {
      query = query.eq('employee.department.name', department);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error fetching leaves summary: ${error.message}`);

    const summary = {
      total_requests: data.length,
      approved: data.filter(l => l.status === 'approved').length,
      pending: data.filter(l => l.status === 'pending').length,
      rejected: data.filter(l => l.status === 'rejected').length,
      total_days_requested: data.reduce((sum, l) => sum + (parseFloat(l.total_days) || 0), 0),
      total_days_approved: data
        .filter(l => l.status === 'approved')
        .reduce((sum, l) => sum + (parseFloat(l.total_days) || 0), 0)
    };

    // Group by leave type
    const byLeaveType = {};
    data.forEach(leave => {
      const type = leave.leave_type?.name || 'Unknown';
      if (!byLeaveType[type]) {
        byLeaveType[type] = { count: 0, days: 0, color: leave.leave_type?.color || '#000000' };
      }
      byLeaveType[type].count += 1;
      byLeaveType[type].days += parseFloat(leave.total_days) || 0;
    });

    return {
      period,
      year,
      month: period === 'month' ? month : null,
      summary,
      by_leave_type: byLeaveType,
      recent_requests: data.slice(0, 10).map(leave => ({
        id: leave.id,
        employee_name: `${leave.employee.first_name} ${leave.employee.last_name}`,
        department: leave.employee.department?.name,
        leave_type: leave.leave_type?.name,
        days: leave.total_days,
        status: leave.status,
        start_date: leave.start_date,
        end_date: leave.end_date
      }))
    };
  }
}

module.exports = new AnalyticsModel();