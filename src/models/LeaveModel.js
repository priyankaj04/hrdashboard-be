const BaseModel = require('./BaseModel');

class LeaveModel extends BaseModel {
  constructor() {
    super('leave_requests');
  }

  // Get leave requests with employee and leave type info
  async findAllWithRelations(filters = {}) {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        employee:employees!employee_id(
          id,
          employee_id,
          first_name,
          last_name,
          personal_email,
          department_id,
          department:departments(id, name),
          position:positions(id, title)
        ),
        approver:employees!approver_id(
          id,
          first_name,
          last_name
        ),
        leave_type:leave_types(id, name, color, is_paid)
      `);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query.order('applied_date', { ascending: false });

    if (error) {
      throw new Error(`Error fetching leave requests: ${error.message}`);
    }

    return data || [];
  }

  // Get leave requests by employee
  async findByEmployee(employeeId, status = null) {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        leave_type:leave_types(id, name, color, is_paid)
      `)
      .eq('employee_id', employeeId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('applied_date', { ascending: false });

    if (error) {
      throw new Error(`Error fetching employee leave requests: ${error.message}`);
    }

    return data || [];
  }

  // Get pending leave requests for approval
  async findPendingForApproval(approverId = null) {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        employee:employees(id, first_name, last_name, employee_id, department:departments(name)),
        leave_type:leave_types(id, name, color, is_paid)
      `)
      .eq('status', 'pending');

    if (approverId) {
      query = query.eq('approver_id', approverId);
    }

    const { data, error } = await query.order('applied_date', { ascending: true });

    if (error) {
      throw new Error(`Error fetching pending leave requests: ${error.message}`);
    }

    return data || [];
  }

  // Get leave requests by date range
  async findByDateRange(startDate, endDate, departmentId = null) {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        employee:employees!employee_id(
          id,
          employee_id,
          first_name,
          last_name,
          personal_email,
          department_id,
          department:departments(id, name),
          position:positions(id, title)
        ),
        approver:employees!approver_id(
          id,
          first_name,
          last_name
        ),
        leave_type:leave_types(id, name, color, is_paid)
      `)
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
      .eq('status', 'approved');

    if (departmentId) {
      query = query.eq('employees.department_id', departmentId);
    }

    const { data, error } = await query.order('start_date');

    if (error) {
      throw new Error(`Error fetching leave requests by date range: ${error.message}`);
    }

    return data || [];
  }

  // Approve leave request
  async approve(id, approverId, notes = null) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({
        status: 'approved',
        approver_id: approverId,
        approved_date: new Date().toISOString(),
        rejection_reason: null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error approving leave request: ${error.message}`);
    }

    return data;
  }

  // Reject leave request
  async reject(id, approverId, rejectionReason) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({
        status: 'rejected',
        approver_id: approverId,
        approved_date: new Date().toISOString(),
        rejection_reason: rejectionReason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error rejecting leave request: ${error.message}`);
    }

    return data;
  }

  // Cancel leave request
  async cancel(id, employeeId) {
    // Verify the request belongs to the employee
    const request = await this.findById(id);
    if (!request || request.employee_id !== employeeId) {
      throw new Error('Leave request not found or unauthorized');
    }

    if (request.status !== 'pending') {
      throw new Error('Can only cancel pending leave requests');
    }

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error cancelling leave request: ${error.message}`);
    }

    return data;
  }

  // Get leave summary for employee
  async getEmployeeLeaveSummary(employeeId, year) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        leave_type:leave_types(id, name, is_paid)
      `)
      .eq('employee_id', employeeId)
      .gte('start_date', `${year}-01-01`)
      .lte('end_date', `${year}-12-31`)
      .in('status', ['approved', 'pending']);

    if (error) {
      throw new Error(`Error fetching leave summary: ${error.message}`);
    }

    const requests = data || [];
    const summary = {
      totalRequests: requests.length,
      approvedRequests: requests.filter(r => r.status === 'approved').length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      totalDaysTaken: requests
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + r.total_days, 0),
      totalPendingDays: requests
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.total_days, 0)
    };

    return summary;
  }

  // Check for overlapping leave requests
  async checkOverlap(employeeId, startDate, endDate, excludeId = null) {
    let query = this.supabase
      .from(this.tableName)
      .select('id, start_date, end_date, status')
      .eq('employee_id', employeeId)
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
      .in('status', ['pending', 'approved']);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error checking leave overlap: ${error.message}`);
    }

    return data || [];
  }

  // Enhanced findAll with pagination and detailed formatting
  async findAllPaginated(filters = {}, pagination = { page: 1, limit: 10 }) {
    const { 
      employee_id, 
      status, 
      type, 
      start_date, 
      end_date, 
      department_id 
    } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let query = this.supabase
      .from(this.tableName)
      .select(`
        id,
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        total_days,
        reason,
        status,
        applied_date,
        approved_date,
        approver_id,
        rejection_reason,
        contact_info,
        created_at,
        updated_at,
        employee:employees!employee_id(
          id,
          employee_id,
          first_name,
          last_name,
          personal_email,
          department_id,
          department:departments(id, name),
          position:positions(id, title)
        ),
        approver:employees!approver_id(
          id,
          first_name,
          last_name
        ),
        leave_type:leave_types(
          id,
          name,
          color,
          is_paid
        )
      `, { count: 'exact' });

    // Apply filters
    if (employee_id) {
      query = query.eq('employee_id', employee_id);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('leave_type_id', type);
    }

    if (start_date) {
      query = query.gte('start_date', start_date);
    }

    if (end_date) {
      query = query.lte('end_date', end_date);
    }

    if (department_id) {
      query = query.eq('employees.department_id', department_id);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('applied_date', { ascending: false });

    if (error) {
      throw new Error(`Error fetching leave requests: ${error.message}`);
    }
    // Format response
    const formattedData = data.map(leave => ({
      id: leave.id,
      employee_id: leave.employee_id,
      employee: {
        id: leave.employee.id,
        name: `${leave.employee.first_name} ${leave.employee.last_name}`,
        department: leave.employee.department?.name || 'N/A',
        email: leave.employee.personal_email,
        position: leave.employee.position?.title || 'N/A'
      },
      leave_type: {
        id: leave.leave_type?.id,
        name: leave.leave_type?.name,
        color: leave.leave_type?.color,
        is_paid: leave.leave_type?.is_paid
      },
      start_date: leave.start_date,
      end_date: leave.end_date,
      days: leave.total_days,
      reason: leave.reason,
      status: leave.status,
      applied_date: leave.applied_date,
      approved_by: null, // TODO: Add approver lookup if needed
      approved_date: leave.approved_date,
      comments: leave.rejection_reason,
      emergency_contact: leave.emergency_contact,
      contact_info: leave.contact_info,
      created_at: leave.created_at,
      updated_at: leave.updated_at
    }));

    return {
      leaves: formattedData,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(count / limit),
        total_records: count,
        per_page: limit
      }
    };
  }

  // Create new leave request with validation
  async createLeaveRequest(leaveData) {
    const { 
      employee_id, 
      type, 
      start_date, 
      end_date, 
      reason, 
      contact_info 
    } = leaveData;

    // Calculate days (excluding weekends)
    const days = this.calculateWorkingDays(start_date, end_date);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        employee_id,
        type,
        start_date,
        end_date,
        total_days: days,
        reason,
        contact_info,
        status: 'pending',
        applied_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating leave request: ${error.message}`);
    }

    return data;
  }

  // Update leave request (only for pending requests)
  async updateLeaveRequest(id, updateData) {
    const { 
      type, 
      start_date, 
      end_date, 
      reason, 
      contact_info 
    } = updateData;

    // Recalculate days if dates changed
    let days;
    if (start_date && end_date) {
      days = this.calculateWorkingDays(start_date, end_date);
    }

    const updateFields = {
      ...(type && { type }),
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(days && { total_days: days }),
      ...(reason && { reason }),
      ...(contact_info !== undefined && { contact_info }),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateFields)
      .eq('id', id)
      .eq('status', 'pending') // Only allow updates to pending requests
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating leave request: ${error.message}`);
    }

    return data;
  }

  // Update leave status with comments
  async updateStatus(id, statusData) {
    const { status, comments, approved_by } = statusData;

    const updateFields = {
      status,
      rejection_reason: comments,
      approver_id: approved_by,
      approved_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating leave status: ${error.message}`);
    }

    return data;
  }

  // Get comprehensive leave statistics
  async getLeaveStatistics(filters = {}) {
    const { employee_id, department_id, year, month } = filters;
    const currentYear = year || new Date().getFullYear();

    let query = this.supabase
      .from(this.tableName)
      .select(`
        id,
        employee_id,
        leave_type_id,
        total_days,
        status,
        start_date,
        end_date,
        employees:employees!employee_id(
          id,
          employee_id,
          first_name,
          last_name,
          personal_email,
          department_id,
          department:departments(id, name)
        ),
        approver:employees!approver_id(
          id,
          first_name,
          last_name
        )
      `);

    // Apply filters
    if (employee_id) {
      query = query.eq('employee_id', employee_id);
    }

    if (department_id) {
      query = query.eq('employees.department_id', department_id);
    }

    // Filter by year
    query = query.gte('start_date', `${currentYear}-01-01`)
                 .lte('start_date', `${currentYear}-12-31`);

    // Filter by month if provided
    if (month) {
      const monthStart = new Date(currentYear, month - 1, 1).toISOString().split('T')[0];
      const monthEnd = new Date(currentYear, month, 0).toISOString().split('T')[0];
      query = query.gte('start_date', monthStart).lte('start_date', monthEnd);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching leave statistics: ${error.message}`);
    }

    // Calculate statistics
    const totalRequests = data.length;
    const pendingRequests = data.filter(leave => leave.status === 'pending').length;
    const approvedRequests = data.filter(leave => leave.status === 'approved').length;
    const rejectedRequests = data.filter(leave => leave.status === 'rejected').length;
    const totalDaysRequested = data.reduce((sum, leave) => sum + (leave.total_days || 0), 0);
    const totalDaysApproved = data
      .filter(leave => leave.status === 'approved')
      .reduce((sum, leave) => sum + (leave.total_days || 0), 0);

    // Group by type
    const byType = {};
    data.forEach(leave => {
      if (!byType[leave.leave_type_id]) {
        byType[leave.leave_type_id] = { count: 0, days: 0 };
      }
      byType[leave.leave_type_id].count++;
      byType[leave.leave_type_id].days += leave.total_days || 0;
    });

    // Group by status
    const byStatus = {
      pending: pendingRequests,
      approved: approvedRequests,
      rejected: rejectedRequests
    };

    // Get employee balance if specific employee
    let employeeBalance = null;
    if (employee_id) {
      employeeBalance = await this.getEmployeeLeaveBalance(employee_id, currentYear);
    }

    return {
      summary: {
        total_requests: totalRequests,
        pending_requests: pendingRequests,
        approved_requests: approvedRequests,
        rejected_requests: rejectedRequests,
        total_days_requested: totalDaysRequested,
        total_days_approved: totalDaysApproved
      },
      by_type: byType,
      by_status: byStatus,
      ...(employeeBalance && { employee_balance: employeeBalance })
    };
  }

  // Get employee leave balance with leave types
  async getEmployeeLeaveBalance(employeeId, year = null) {
    const currentYear = year || new Date().getFullYear();

    // Get all leave requests for the employee in the year
    const { data: leaveRequests, error } = await this.supabase
      .from(this.tableName)
      .select('leave_type_id, total_days, status')
      .eq('employee_id', employeeId)
      .gte('start_date', `${currentYear}-01-01`)
      .lte('start_date', `${currentYear}-12-31`);

    if (error) {
      throw new Error(`Error fetching employee leave balance: ${error.message}`);
    }

    // Get leave types
    const { data: leaveTypes, error: leaveTypesError } = await this.supabase
      .from('leave_types')
      .select('*');

    if (leaveTypesError) {
      throw new Error(`Error fetching leave types: ${leaveTypesError.message}`);
    }

    // Calculate balance for each leave type
    const leaveTypeBalances = {};
    let totalAllocated = 0;
    let totalUsed = 0;
    let totalPending = 0;

    leaveTypes.forEach(leaveType => {
      const typeRequests = leaveRequests.filter(req => req.leave_type_id === leaveType.id);
      const used = typeRequests
        .filter(req => req.status === 'approved')
        .reduce((sum, req) => sum + (req.total_days || 0), 0);
      const pending = typeRequests
        .filter(req => req.status === 'pending')
        .reduce((sum, req) => sum + (req.total_days || 0), 0);
      
      const allocated = leaveType.max_days || 25; // Default 25 days if not specified
      const remaining = Math.max(0, allocated - used - pending);

      leaveTypeBalances[leaveType.id] = {
        allocated,
        used,
        pending,
        remaining
      };

      totalAllocated += allocated;
      totalUsed += used;
      totalPending += pending;
    });

    const totalRemaining = Math.max(0, totalAllocated - totalUsed - totalPending);

    return {
      total_allocated: totalAllocated,
      used: totalUsed,
      pending: totalPending,
      remaining: totalRemaining
    };
  }

  // Get leave calendar data
  async getLeaveCalendar(startDate, endDate, filters = {}) {
    const { department_id, employee_id } = filters;

    let query = this.supabase
      .from(this.tableName)
      .select(`
        employee_id,
        leave_type_id,
        status,
        start_date,
        end_date,
        employee:employees!employee_id(
          id,
          employee_id,
          first_name,
          last_name,
          personal_email,
          department_id,
          department:departments(id, name),
          position:positions(id, title)
        ),
        approver:employees!approver_id(
          id,
          first_name,
          last_name
        ),
      `)
      .eq('status', 'approved') // Only show approved leaves
      .lte('start_date', endDate)
      .gte('end_date', startDate);

    if (department_id) {
      query = query.eq('employees.department_id', department_id);
    }

    if (employee_id) {
      query = query.eq('employee_id', employee_id);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching leave calendar: ${error.message}`);
    }

    // Group leaves by date
    const leavesByDate = {};
    const employeesOnLeave = new Set();

    data.forEach(leave => {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      
      // Create entries for each day of the leave
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        
        if (!leavesByDate[dateStr]) {
          leavesByDate[dateStr] = {
            date: dateStr,
            employees: []
          };
        }

        leavesByDate[dateStr].employees.push({
          employee_id: leave.employee_id,
          name: `${leave.employee.first_name} ${leave.employee.last_name}`,
          type: leave.leave_type_id,
          status: leave.status
        });

        employeesOnLeave.add(leave.employee_id);
      }
    });

    // Convert to array and calculate summary
    const leaves = Object.values(leavesByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    const totalLeaveDays = leaves.reduce((sum, day) => sum + day.employees.length, 0);

    return {
      leaves,
      summary: {
        total_leave_days: totalLeaveDays,
        employees_on_leave: employeesOnLeave.size
      }
    };
  }

  // Get all leave types
  async getLeaveTypes() {
    const { data, error } = await this.supabase
      .from('leave_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Error fetching leave types: ${error.message}`);
    }

    return data.map(type => ({
      id: type.id,
      name: type.name,
      max_days: type.max_days || 25,
      requires_medical_certificate: type.requires_medical_certificate || false,
      advance_notice_days: type.advance_notice_days || 0
    }));
  }

  // Bulk update leave status
  async bulkUpdateStatus(leaveIds, statusData) {
    const { status, comments, approved_by } = statusData;
    const results = [];

    for (const leaveId of leaveIds) {
      try {
        const result = await this.updateStatus(leaveId, { status, comments, approved_by });
        results.push({
          leave_id: leaveId,
          status: 'success',
          message: status === 'approved' ? 'Approved' : 'Rejected',
          data: result
        });
      } catch (error) {
        results.push({
          leave_id: leaveId,
          status: 'error',
          message: error.message
        });
      }
    }

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'error').length;

    return {
      processed: leaveIds.length,
      successful,
      failed,
      results
    };
  }

  // Helper method to calculate working days
  calculateWorkingDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = 0;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      // Skip weekends (Saturday = 6, Sunday = 0)
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
    }

    return Math.max(1, days); // At least 1 day
  }
}

module.exports = new LeaveModel();