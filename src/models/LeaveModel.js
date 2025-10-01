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
        employee:employees(id, first_name, last_name, employee_id, department:departments(name)),
        leave_type:leave_types(id, name, color, is_paid),
        approver:employees!approver_id(id, first_name, last_name, employee_id)
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
        leave_type:leave_types(id, name, color, is_paid),
        approver:employees!approver_id(id, first_name, last_name, employee_id)
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
        employee:employees(id, first_name, last_name, employee_id, department_id, department:departments(name)),
        leave_type:leave_types(id, name, color, is_paid)
      `)
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
      .eq('status', 'approved');

    if (departmentId) {
      query = query.eq('employee.department_id', departmentId);
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
}

module.exports = new LeaveModel();