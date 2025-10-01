const BaseModel = require('./BaseModel');

class EmployeeModel extends BaseModel {
  constructor() {
    super('employees');
  }

  // Get employee with user information
  async findByIdWithUser(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        user:users(id, email, role, is_active),
        department:departments(id, name, color),
        position:positions(id, title),
        manager:employees!manager_id(id, first_name, last_name, employee_id)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching employee: ${error.message}`);
    }

    return data;
  }

  // Get employee by user ID
  async findByUserId(userId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        user:users(id, email, role, is_active),
        department:departments(id, name, color),
        position:positions(id, title),
        manager:employees!manager_id(id, first_name, last_name, employee_id)
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching employee by user ID: ${error.message}`);
    }

    return data;
  }

  // Get employee by employee ID
  async findByEmployeeId(employeeId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        user:users(id, email, role, is_active),
        department:departments(id, name, color),
        position:positions(id, title),
        manager:employees!manager_id(id, first_name, last_name, employee_id)
      `)
      .eq('employee_id', employeeId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching employee by employee ID: ${error.message}`);
    }

    return data;
  }

  // Get all employees with relations
  async findAllWithRelations(filters = {}) {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        user:users(id, email, role, is_active),
        department:departments(id, name, color),
        position:positions(id, title),
        manager:employees!manager_id(id, first_name, last_name, employee_id)
      `);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching employees: ${error.message}`);
    }

    return data || [];
  }

  // Get employees by department
  async findByDepartment(departmentId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        user:users(id, email, role, is_active),
        position:positions(id, title)
      `)
      .eq('department_id', departmentId)
      .eq('employment_status', 'active');

    if (error) {
      throw new Error(`Error fetching employees by department: ${error.message}`);
    }

    return data || [];
  }

  // Get employees by manager
  async findByManager(managerId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        user:users(id, email, role, is_active),
        department:departments(id, name, color),
        position:positions(id, title)
      `)
      .eq('manager_id', managerId)
      .eq('employment_status', 'active');

    if (error) {
      throw new Error(`Error fetching employees by manager: ${error.message}`);
    }

    return data || [];
  }

  // Get active employees only
  async findActiveEmployees() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        user:users(id, email, role, is_active),
        department:departments(id, name, color),
        position:positions(id, title),
        manager:employees!manager_id(id, first_name, last_name, employee_id)
      `)
      .eq('employment_status', 'active');

    if (error) {
      throw new Error(`Error fetching active employees: ${error.message}`);
    }

    return data || [];
  }

  // Search employees by name
  async searchByName(searchTerm) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        user:users(id, email, role, is_active),
        department:departments(id, name, color),
        position:positions(id, title)
      `)
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,employee_id.ilike.%${searchTerm}%`);

    if (error) {
      throw new Error(`Error searching employees: ${error.message}`);
    }

    return data || [];
  }

  // Update employment status
  async updateEmploymentStatus(id, status, terminationDate = null) {
    const updateData = { employment_status: status };
    if (terminationDate) {
      updateData.termination_date = terminationDate;
    }

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating employment status: ${error.message}`);
    }

    return data;
  }
}

module.exports = new EmployeeModel();