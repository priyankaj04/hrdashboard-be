const BaseModel = require('./BaseModel');

class AttendanceModel extends BaseModel {
  constructor() {
    super('attendance_records');
  }

  // Get attendance by employee and date range
  async findByEmployeeAndDateRange(employeeId, startDate, endDate) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        employee:employees(id, first_name, last_name, employee_id)
      `)
      .eq('employee_id', employeeId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Error fetching attendance records: ${error.message}`);
    }

    return data || [];
  }

  // Get attendance for a specific date
  async findByDate(date, departmentId = null) {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        employee:employees(id, first_name, last_name, employee_id, department_id, department:departments(name))
      `)
      .eq('date', date);

    if (departmentId) {
      query = query.eq('employee.department_id', departmentId);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Error fetching attendance for date: ${error.message}`);
    }

    return data || [];
  }

  // Get attendance summary for an employee
  async getEmployeeSummary(employeeId, month, year) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('employee_id', employeeId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      throw new Error(`Error fetching attendance summary: ${error.message}`);
    }

    const records = data || [];
    const summary = {
      totalDays: records.length,
      presentDays: records.filter(r => r.status === 'present').length,
      absentDays: records.filter(r => r.status === 'absent').length,
      lateDays: records.filter(r => r.status === 'late').length,
      halfDays: records.filter(r => r.status === 'half-day').length,
      totalHours: records.reduce((sum, r) => sum + (r.total_hours || 0), 0),
      overtimeHours: records.reduce((sum, r) => sum + (r.overtime_hours || 0), 0)
    };

    return summary;
  }

  // Check if attendance exists for employee and date
  async findByEmployeeAndDate(employeeId, date) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error checking attendance: ${error.message}`);
    }

    return data;
  }

  // Update check-in time
  async checkIn(employeeId, date, checkInTime, location = null, ipAddress = null) {
    const existingRecord = await this.findByEmployeeAndDate(employeeId, date);
    
    if (existingRecord) {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          check_in: checkInTime,
          location,
          ip_address: ipAddress,
          status: 'present'
        })
        .eq('id', existingRecord.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating check-in: ${error.message}`);
      }

      return data;
    } else {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert({
          employee_id: employeeId,
          date,
          check_in: checkInTime,
          location,
          ip_address: ipAddress,
          status: 'present'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating check-in: ${error.message}`);
      }

      return data;
    }
  }

  // Update check-out time and calculate total hours
  async checkOut(employeeId, date, checkOutTime) {
    const record = await this.findByEmployeeAndDate(employeeId, date);
    
    if (!record) {
      throw new Error('No check-in record found for today');
    }

    if (!record.check_in) {
      throw new Error('Cannot check out without checking in first');
    }

    // Calculate total hours
    const checkIn = new Date(`${date}T${record.check_in}`);
    const checkOut = new Date(`${date}T${checkOutTime}`);
    const totalHours = (checkOut - checkIn) / (1000 * 60 * 60);

    // Calculate overtime (assuming 8 hours is standard)
    const standardHours = 8;
    const overtimeHours = Math.max(0, totalHours - standardHours);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({
        check_out: checkOutTime,
        total_hours: Math.round(totalHours * 100) / 100,
        overtime_hours: Math.round(overtimeHours * 100) / 100
      })
      .eq('id', record.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating check-out: ${error.message}`);
    }

    return data;
  }

  // Get department attendance summary
  async getDepartmentSummary(departmentId, date) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        employee:employees!inner(id, first_name, last_name, department_id)
      `)
      .eq('date', date)
      .eq('employee.department_id', departmentId);

    if (error) {
      throw new Error(`Error fetching department attendance: ${error.message}`);
    }

    const records = data || [];
    return {
      totalEmployees: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      halfDay: records.filter(r => r.status === 'half-day').length
    };
  }

  // Get monthly attendance data
  async getMonthlyAttendance(month, year, departmentId = null, employeeId = null) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${daysInMonth.toString().padStart(2, '0')}`;

    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        employee:employees(
          id, 
          first_name, 
          last_name, 
          employee_id, 
          department_id,
          department:departments(name),
          position:positions(title)
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (departmentId) {
      query = query.eq('employee.department_id', departmentId);
    }

    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching monthly attendance: ${error.message}`);
    }

    const records = data || [];
    
    // Calculate working days (excluding weekends)
    let workingDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        workingDays++;
      }
    }

    // Group data by employee and department
    const employeeData = {};
    const departmentData = {};
    let totalEmployees = new Set();

    // Process records
    records.forEach(record => {
      const empId = record.employee_id;
      const deptName = record.employee?.department?.name || 'Unknown';
      
      totalEmployees.add(empId);

      // Initialize employee data
      if (!employeeData[empId]) {
        employeeData[empId] = {
          employee_id: empId,
          employee: {
            id: empId,
            name: `${record.employee?.first_name || ''} ${record.employee?.last_name || ''}`.trim(),
            department: deptName,
            position: record.employee?.position?.title || 'N/A'
          },
          attendance_summary: {
            present_days: 0,
            absent_days: 0,
            late_days: 0,
            half_days: 0,
            attendance_rate: 0
          },
          records: []
        };
      }

      // Initialize department data
      if (!departmentData[deptName]) {
        departmentData[deptName] = {
          department: deptName,
          total_employees: 0,
          present: 0,
          absent: 0,
          late: 0,
          half_day: 0,
          attendance_rate: 0,
          employeeIds: new Set()
        };
      }

      departmentData[deptName].employeeIds.add(empId);
      const empData = employeeData[empId];
      
      // Add record to employee
      empData.records.push({
        id: record.id,
        date: record.date,
        check_in: record.check_in,
        check_out: record.check_out,
        total_hours: record.total_hours || 0,
        status: record.status,
        notes: record.notes
      });

      // Count by status for both employee and department
      switch (record.status) {
        case 'present':
          empData.attendance_summary.present_days++;
          departmentData[deptName].present++;
          break;
        case 'absent':
          empData.attendance_summary.absent_days++;
          departmentData[deptName].absent++;
          break;
        case 'late':
          empData.attendance_summary.late_days++;
          departmentData[deptName].late++;
          break;
        case 'half-day':
          empData.attendance_summary.half_days++;
          departmentData[deptName].half_day++;
          break;
        case 'sick':
          empData.attendance_summary.absent_days++;
          departmentData[deptName].absent++;
          break;
        case 'vacation':
          empData.attendance_summary.absent_days++;
          departmentData[deptName].absent++;
          break;
      }
    });

    // Calculate percentages and finalize data
    const employees = Object.values(employeeData).map(emp => {
      const totalDays = emp.records.length;
      emp.attendance_summary.attendance_rate = totalDays > 0 
        ? Math.round((emp.attendance_summary.present_days / totalDays) * 100 * 10) / 10
        : 0;
      return emp;
    });

    const department_wise = Object.values(departmentData).map(dept => {
      dept.total_employees = dept.employeeIds.size;
      const totalRecords = dept.present + dept.absent + dept.late + dept.half_day;
      dept.attendance_rate = totalRecords > 0 
        ? Math.round((dept.present / totalRecords) * 100 * 10) / 10
        : 0;
      delete dept.employeeIds; // Remove the Set from response
      return dept;
    });

    // Calculate overall summary
    const totalRecords = records.length;
    const totalPresent = records.filter(r => r.status === 'present').length;
    const totalAbsent = records.filter(r => ['absent', 'sick', 'vacation'].includes(r.status)).length;
    const totalLate = records.filter(r => r.status === 'late').length;
    const totalHalfDay = records.filter(r => r.status === 'half-day').length;

    const summary = {
      summary: {
        total_records: totalRecords,
        total_employees: totalEmployees.size,
        working_days: workingDays,
        overall_attendance_rate: totalRecords > 0 
          ? Math.round((totalPresent / totalRecords) * 100 * 10) / 10
          : 0,
        present_count: totalPresent,
        absent_count: totalAbsent,
        late_count: totalLate,
        half_day_count: totalHalfDay
      },
      department_wise,
      employees
    };

    return summary;
  }

  // Get daily attendance data
  async getDailyAttendance(date, departmentId = null, employeeId = null) {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        employee:employees(
          id, 
          first_name, 
          last_name, 
          employee_id, 
          department_id,
          department:departments(name),
          position:positions(title)
        )
      `)
      .eq('date', date)
      .order('check_in', { ascending: true });

    if (departmentId) {
      query = query.eq('employee.department_id', departmentId);
    }

    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching daily attendance: ${error.message}`);
    }

    const records = data || [];
    
    // Calculate summary
    const totalEmployees = records.length;
    const presentCount = records.filter(r => r.status === 'present').length;
    const absentCount = records.filter(r => ['absent', 'sick', 'vacation'].includes(r.status)).length;
    const lateCount = records.filter(r => r.status === 'late').length;
    const halfDayCount = records.filter(r => r.status === 'half-day').length;

    const summary = {
      total_employees: totalEmployees,
      present_count: presentCount,
      absent_count: absentCount,
      late_count: lateCount,
      half_day_count: halfDayCount,
      attendance_rate: totalEmployees > 0 
        ? Math.round((presentCount / totalEmployees) * 100 * 10) / 10
        : 0
    };

    // Format records
    const formattedRecords = records.map(record => ({
      id: record.id,
      employee_id: record.employee_id,
      employee: {
        id: record.employee_id,
        name: `${record.employee?.first_name || ''} ${record.employee?.last_name || ''}`.trim(),
        department: record.employee?.department?.name || 'Unknown',
        position: record.employee?.position?.title || 'N/A'
      },
      date: record.date,
      check_in: record.check_in,
      check_out: record.check_out,
      total_hours: record.total_hours || 0,
      status: record.status,
      notes: record.notes
    }));

    return {
      date,
      summary,
      records: formattedRecords
    };
  }

  // Get attendance analytics
  async getAnalytics(startDate, endDate, period = 'monthly') {
    const start = startDate || moment().startOf('month').format('YYYY-MM-DD');
    const end = endDate || moment().endOf('month').format('YYYY-MM-DD');

    // Get attendance records for the period
    const { data: records, error } = await supabase
      .from('attendance')
      .select(`
        id,
        employee_id,
        date,
        check_in,
        check_out,
        total_hours,
        status,
        employee:employees!inner(
          id,
          first_name,
          last_name,
          department_id,
          department:departments(id, name)
        )
      `)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Error fetching analytics data: ${error.message}`);
    }

    const attendanceRecords = records || [];

    // Calculate overall statistics
    const totalRecords = attendanceRecords.length;
    const uniqueEmployees = [...new Set(attendanceRecords.map(r => r.employee_id))].length;
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const absentCount = attendanceRecords.filter(r => ['absent', 'sick', 'vacation'].includes(r.status)).length;
    const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
    const halfDayCount = attendanceRecords.filter(r => r.status === 'half-day').length;

    // Calculate average attendance rate
    const overallAttendanceRate = totalRecords > 0 
      ? Math.round((presentCount / totalRecords) * 100 * 10) / 10 
      : 0;

    // Department-wise analysis
    const departmentStats = {};
    attendanceRecords.forEach(record => {
      const deptId = record.employee?.department_id;
      const deptName = record.employee?.department?.name || 'Unknown';
      
      if (!departmentStats[deptId]) {
        departmentStats[deptId] = {
          department_id: deptId,
          department_name: deptName,
          total_records: 0,
          present_count: 0,
          absent_count: 0,
          late_count: 0,
          half_day_count: 0,
          unique_employees: new Set()
        };
      }

      departmentStats[deptId].total_records++;
      departmentStats[deptId].unique_employees.add(record.employee_id);
      
      if (record.status === 'present') departmentStats[deptId].present_count++;
      else if (['absent', 'sick', 'vacation'].includes(record.status)) departmentStats[deptId].absent_count++;
      else if (record.status === 'late') departmentStats[deptId].late_count++;
      else if (record.status === 'half-day') departmentStats[deptId].half_day_count++;
    });

    // Convert department stats to array and calculate attendance rates
    const departmentAnalysis = Object.values(departmentStats).map(dept => ({
      department_id: dept.department_id,
      department_name: dept.department_name,
      total_employees: dept.unique_employees.size,
      total_records: dept.total_records,
      present_count: dept.present_count,
      absent_count: dept.absent_count,
      late_count: dept.late_count,
      half_day_count: dept.half_day_count,
      attendance_rate: dept.total_records > 0 
        ? Math.round((dept.present_count / dept.total_records) * 100 * 10) / 10 
        : 0
    }));

    // Time-based trends (daily breakdown for the period)
    const dateStats = {};
    attendanceRecords.forEach(record => {
      if (!dateStats[record.date]) {
        dateStats[record.date] = {
          date: record.date,
          total_records: 0,
          present_count: 0,
          absent_count: 0,
          late_count: 0,
          half_day_count: 0
        };
      }

      dateStats[record.date].total_records++;
      if (record.status === 'present') dateStats[record.date].present_count++;
      else if (['absent', 'sick', 'vacation'].includes(record.status)) dateStats[record.date].absent_count++;
      else if (record.status === 'late') dateStats[record.date].late_count++;
      else if (record.status === 'half-day') dateStats[record.date].half_day_count++;
    });

    const dailyTrends = Object.values(dateStats).map(day => ({
      ...day,
      attendance_rate: day.total_records > 0 
        ? Math.round((day.present_count / day.total_records) * 100 * 10) / 10 
        : 0
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Top performers (employees with highest attendance rates)
    const employeeStats = {};
    attendanceRecords.forEach(record => {
      if (!employeeStats[record.employee_id]) {
        employeeStats[record.employee_id] = {
          employee_id: record.employee_id,
          employee_name: `${record.employee?.first_name} ${record.employee?.last_name}`,
          department: record.employee?.department?.name || 'Unknown',
          total_records: 0,
          present_count: 0
        };
      }

      employeeStats[record.employee_id].total_records++;
      if (record.status === 'present') {
        employeeStats[record.employee_id].present_count++;
      }
    });

    const topPerformers = Object.values(employeeStats)
      .map(emp => ({
        ...emp,
        attendance_rate: emp.total_records > 0 
          ? Math.round((emp.present_count / emp.total_records) * 100 * 10) / 10 
          : 0
      }))
      .sort((a, b) => b.attendance_rate - a.attendance_rate)
      .slice(0, 10);

    // Calculate average hours worked
    const totalHours = attendanceRecords
      .filter(r => r.total_hours)
      .reduce((sum, r) => sum + parseFloat(r.total_hours || 0), 0);
    const avgHoursPerDay = totalRecords > 0 ? Math.round((totalHours / totalRecords) * 10) / 10 : 0;

    return {
      period: {
        start_date: start,
        end_date: end,
        period_type: period
      },
      overall_statistics: {
        total_records: totalRecords,
        unique_employees: uniqueEmployees,
        present_count: presentCount,
        absent_count: absentCount,
        late_count: lateCount,
        half_day_count: halfDayCount,
        overall_attendance_rate: overallAttendanceRate,
        average_hours_per_day: avgHoursPerDay
      },
      department_analysis: departmentAnalysis,
      daily_trends: dailyTrends,
      top_performers: topPerformers
    };
  }

  // Get employees with attendance summary
  async getEmployeesWithAttendance(page = 1, limit = 10, departmentId = null, searchTerm = null, startDate = null, endDate = null) {
    const offset = (page - 1) * limit;
    
    // Default date range to current month if not provided
    const start = startDate || moment().startOf('month').format('YYYY-MM-DD');
    const end = endDate || moment().endOf('month').format('YYYY-MM-DD');

    // Build employee query
    let employeeQuery = supabase
      .from('employees')
      .select(`
        id,
        first_name,
        last_name,
        email,
        employee_id,
        status,
        hire_date,
        department_id,
        position_id,
        department:departments(id, name),
        position:positions(id, title)
      `, { count: 'exact' });

    if (departmentId) {
      employeeQuery = employeeQuery.eq('department_id', departmentId);
    }

    if (searchTerm) {
      employeeQuery = employeeQuery.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,employee_id.ilike.%${searchTerm}%`
      );
    }

    const { data: employees, error: employeeError, count: totalCount } = await employeeQuery
      .range(offset, offset + limit - 1)
      .order('first_name', { ascending: true });

    if (employeeError) {
      throw new Error(`Error fetching employees: ${employeeError.message}`);
    }

    // Get attendance data for all employees in the result
    const employeeIds = employees.map(emp => emp.id);
    
    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from('attendance')
      .select('employee_id, date, status, total_hours')
      .in('employee_id', employeeIds)
      .gte('date', start)
      .lte('date', end);

    if (attendanceError) {
      throw new Error(`Error fetching attendance data: ${attendanceError.message}`);
    }

    // Group attendance by employee
    const attendanceByEmployee = {};
    attendanceRecords.forEach(record => {
      if (!attendanceByEmployee[record.employee_id]) {
        attendanceByEmployee[record.employee_id] = [];
      }
      attendanceByEmployee[record.employee_id].push(record);
    });

    // Calculate working days (excluding weekends)
    const workingDays = moment(end).diff(moment(start), 'days') + 1;
    const weekends = Math.floor(workingDays / 7) * 2;
    const totalWorkingDays = Math.max(1, workingDays - weekends);

    // Build response with attendance summary for each employee
    const employeesWithAttendance = employees.map(employee => {
      const empAttendance = attendanceByEmployee[employee.id] || [];
      
      const presentCount = empAttendance.filter(r => r.status === 'present').length;
      const absentCount = empAttendance.filter(r => ['absent', 'sick', 'vacation'].includes(r.status)).length;
      const lateCount = empAttendance.filter(r => r.status === 'late').length;
      const halfDayCount = empAttendance.filter(r => r.status === 'half-day').length;
      
      const totalHours = empAttendance
        .filter(r => r.total_hours)
        .reduce((sum, r) => sum + parseFloat(r.total_hours || 0), 0);
      
      const attendanceRate = totalWorkingDays > 0 
        ? Math.round((presentCount / totalWorkingDays) * 100 * 10) / 10 
        : 0;

      return {
        id: employee.id,
        employee_id: employee.employee_id,
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
        status: employee.status,
        hire_date: employee.hire_date,
        department: {
          id: employee.department?.id,
          name: employee.department?.name || 'Not Assigned'
        },
        position: {
          id: employee.position?.id,
          title: employee.position?.title || 'Not Assigned'
        },
        attendance_summary: {
          period: {
            start_date: start,
            end_date: end,
            working_days: totalWorkingDays
          },
          total_records: empAttendance.length,
          present_count: presentCount,
          absent_count: absentCount,
          late_count: lateCount,
          half_day_count: halfDayCount,
          attendance_rate: attendanceRate,
          total_hours: Math.round(totalHours * 10) / 10,
          average_hours_per_day: empAttendance.length > 0 
            ? Math.round((totalHours / empAttendance.length) * 10) / 10 
            : 0
        }
      };
    });

    return {
      employees: employeesWithAttendance,
      pagination: {
        current_page: page,
        per_page: limit,
        total_records: totalCount,
        total_pages: Math.ceil(totalCount / limit)
      },
      period: {
        start_date: start,
        end_date: end
      }
    };
  }

  // Get departments with employee counts and attendance stats
  async getDepartmentsWithStats(startDate = null, endDate = null) {
    const start = startDate || moment().startOf('month').format('YYYY-MM-DD');
    const end = endDate || moment().endOf('month').format('YYYY-MM-DD');

    // Get all departments with employee counts
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select(`
        id,
        name,
        description,
        created_at,
        employees:employees(
          id,
          first_name,
          last_name,
          status,
          hire_date,
          position:positions(title)
        )
      `)
      .order('name', { ascending: true });

    if (deptError) {
      throw new Error(`Error fetching departments: ${deptError.message}`);
    }

    // Get attendance data for the period
    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from('attendance')
      .select(`
        employee_id,
        date,
        status,
        total_hours,
        employee:employees!inner(
          department_id,
          department:departments(id, name)
        )
      `)
      .gte('date', start)
      .lte('date', end);

    if (attendanceError) {
      throw new Error(`Error fetching attendance data: ${attendanceError.message}`);
    }

    // Group attendance by department
    const attendanceByDept = {};
    attendanceRecords.forEach(record => {
      const deptId = record.employee?.department_id;
      if (!attendanceByDept[deptId]) {
        attendanceByDept[deptId] = [];
      }
      attendanceByDept[deptId].push(record);
    });

    // Calculate working days
    const workingDays = moment(end).diff(moment(start), 'days') + 1;
    const weekends = Math.floor(workingDays / 7) * 2;
    const totalWorkingDays = Math.max(1, workingDays - weekends);

    // Build response with department stats
    const departmentsWithStats = departments.map(dept => {
      const employees = dept.employees || [];
      const activeEmployees = employees.filter(emp => emp.status === 'active');
      const deptAttendance = attendanceByDept[dept.id] || [];
      
      // Calculate attendance statistics
      const presentCount = deptAttendance.filter(r => r.status === 'present').length;
      const absentCount = deptAttendance.filter(r => ['absent', 'sick', 'vacation'].includes(r.status)).length;
      const lateCount = deptAttendance.filter(r => r.status === 'late').length;
      const halfDayCount = deptAttendance.filter(r => r.status === 'half-day').length;
      
      const totalHours = deptAttendance
        .filter(r => r.total_hours)
        .reduce((sum, r) => sum + parseFloat(r.total_hours || 0), 0);

      const attendanceRate = deptAttendance.length > 0 
        ? Math.round((presentCount / deptAttendance.length) * 100 * 10) / 10 
        : 0;

      // Find department manager (if any employee has manager role)
      const manager = employees.find(emp => 
        emp.position?.title?.toLowerCase().includes('manager') ||
        emp.position?.title?.toLowerCase().includes('head') ||
        emp.position?.title?.toLowerCase().includes('director')
      );

      return {
        id: dept.id,
        name: dept.name,
        description: dept.description,
        created_at: dept.created_at,
        employee_counts: {
          total_employees: employees.length,
          active_employees: activeEmployees.length,
          inactive_employees: employees.length - activeEmployees.length
        },
        manager: manager ? {
          id: manager.id,
          name: `${manager.first_name} ${manager.last_name}`,
          position: manager.position?.title || 'N/A',
          hire_date: manager.hire_date
        } : null,
        attendance_summary: {
          period: {
            start_date: start,
            end_date: end,
            working_days: totalWorkingDays
          },
          total_records: deptAttendance.length,
          present_count: presentCount,
          absent_count: absentCount,
          late_count: lateCount,
          half_day_count: halfDayCount,
          attendance_rate: attendanceRate,
          total_hours: Math.round(totalHours * 10) / 10,
          average_hours_per_employee: activeEmployees.length > 0 && deptAttendance.length > 0
            ? Math.round((totalHours / activeEmployees.length) * 10) / 10
            : 0
        },
        recent_employees: activeEmployees
          .sort((a, b) => new Date(b.hire_date) - new Date(a.hire_date))
          .slice(0, 5)
          .map(emp => ({
            id: emp.id,
            name: `${emp.first_name} ${emp.last_name}`,
            position: emp.position?.title || 'N/A',
            hire_date: emp.hire_date
          }))
      };
    });

    return {
      departments: departmentsWithStats,
      period: {
        start_date: start,
        end_date: end
      },
      summary: {
        total_departments: departments.length,
        total_employees: departments.reduce((sum, dept) => sum + (dept.employees?.length || 0), 0),
        active_employees: departments.reduce((sum, dept) => 
          sum + (dept.employees?.filter(emp => emp.status === 'active').length || 0), 0
        )
      }
    };
  }

  // Get attendance data for export
  async getAttendanceForExport(startDate, endDate, departmentId = null, employeeId = null, format = 'csv') {
    const start = startDate || moment().startOf('month').format('YYYY-MM-DD');
    const end = endDate || moment().endOf('month').format('YYYY-MM-DD');

    // Build query
    let query = supabase
      .from('attendance')
      .select(`
        id,
        employee_id,
        date,
        check_in,
        check_out,
        total_hours,
        status,
        notes,
        created_at,
        updated_at,
        employee:employees!inner(
          id,
          employee_id,
          first_name,
          last_name,
          email,
          hire_date,
          department_id,
          position_id,
          department:departments(id, name),
          position:positions(id, title)
        )
      `)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: true })
      .order('employee.first_name', { ascending: true });

    if (departmentId) {
      query = query.eq('employee.department_id', departmentId);
    }

    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data: records, error } = await query;

    if (error) {
      throw new Error(`Error fetching export data: ${error.message}`);
    }

    // Format data for export
    const exportData = records.map(record => ({
      id: record.id,
      employee_id: record.employee?.employee_id || record.employee_id,
      employee_name: `${record.employee?.first_name} ${record.employee?.last_name}`,
      email: record.employee?.email || '',
      department: record.employee?.department?.name || 'N/A',
      position: record.employee?.position?.title || 'N/A',
      date: record.date,
      check_in: record.check_in || '',
      check_out: record.check_out || '',
      total_hours: record.total_hours || 0,
      status: record.status,
      notes: record.notes || '',
      hire_date: record.employee?.hire_date || '',
      created_at: record.created_at,
      updated_at: record.updated_at
    }));

    // Generate summary statistics
    const totalRecords = exportData.length;
    const uniqueEmployees = [...new Set(exportData.map(r => r.employee_id))].length;
    const presentCount = exportData.filter(r => r.status === 'present').length;
    const absentCount = exportData.filter(r => ['absent', 'sick', 'vacation'].includes(r.status)).length;
    const lateCount = exportData.filter(r => r.status === 'late').length;
    const halfDayCount = exportData.filter(r => r.status === 'half-day').length;
    const totalHours = exportData.reduce((sum, r) => sum + parseFloat(r.total_hours || 0), 0);

    const summary = {
      export_info: {
        generated_at: moment().toISOString(),
        period: {
          start_date: start,
          end_date: end
        },
        format: format,
        filters: {
          department_id: departmentId,
          employee_id: employeeId
        }
      },
      statistics: {
        total_records: totalRecords,
        unique_employees: uniqueEmployees,
        present_count: presentCount,
        absent_count: absentCount,
        late_count: lateCount,
        half_day_count: halfDayCount,
        total_hours: Math.round(totalHours * 10) / 10,
        attendance_rate: totalRecords > 0 
          ? Math.round((presentCount / totalRecords) * 100 * 10) / 10 
          : 0
      }
    };

    return {
      summary,
      data: exportData
    };
  }

  // Generate CSV content
  generateCSV(data, summary) {
    const headers = [
      'ID', 'Employee ID', 'Employee Name', 'Email', 'Department', 'Position',
      'Date', 'Check In', 'Check Out', 'Total Hours', 'Status', 'Notes',
      'Hire Date', 'Created At', 'Updated At'
    ];

    let csvContent = headers.join(',') + '\n';
    
    // Add summary as comments
    csvContent += `# Export Summary\n`;
    csvContent += `# Generated: ${summary.export_info.generated_at}\n`;
    csvContent += `# Period: ${summary.export_info.period.start_date} to ${summary.export_info.period.end_date}\n`;
    csvContent += `# Total Records: ${summary.statistics.total_records}\n`;
    csvContent += `# Unique Employees: ${summary.statistics.unique_employees}\n`;
    csvContent += `# Attendance Rate: ${summary.statistics.attendance_rate}%\n`;
    csvContent += `#\n`;

    // Add data rows
    data.forEach(row => {
      const values = [
        row.id,
        row.employee_id,
        `"${row.employee_name}"`,
        row.email,
        `"${row.department}"`,
        `"${row.position}"`,
        row.date,
        row.check_in,
        row.check_out,
        row.total_hours,
        row.status,
        `"${row.notes}"`,
        row.hire_date,
        row.created_at,
        row.updated_at
      ];
      csvContent += values.join(',') + '\n';
    });

    return csvContent;
  }
}

module.exports = new AttendanceModel();