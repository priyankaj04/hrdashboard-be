const BaseModel = require('./BaseModel');

class DepartmentModel extends BaseModel {
  constructor() {
    super('departments');
  }

  // Get department with manager information
  async findByIdWithManager(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        manager:users!manager_id(id, email),
        manager_employee:employees!departments_manager_id_fkey(id, first_name, last_name, employee_id)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching department: ${error.message}`);
    }

    return data;
  }

  // Get all departments with manager info and employee count
async findAllWithStats() {
    const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`
            *,
            manager:users!manager_id(id, email)
        `);

    if (error) {
        throw new Error(`Error fetching departments with stats: ${error.message}`);
    }

    return data || [];
}

  // Get active departments only
async findActiveDepartments() {
    const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('is_active', true);

    if (error) {
        throw new Error(`Error fetching active departments: ${error.message}`);
    }

    return data || [];
}

  // Update department manager
  async updateManager(id, managerId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ manager_id: managerId })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating department manager: ${error.message}`);
    }

    return data;
  }

  // Get department budget utilization
  async getBudgetStats(id) {
    const { data: employees, error } = await this.supabase
      .from('employees')
      .select('salary')
      .eq('department_id', id)
      .eq('employment_status', 'active');

    if (error) {
      throw new Error(`Error fetching department budget stats: ${error.message}`);
    }

    const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    
    const department = await this.findById(id);
    const budget = department?.budget || 0;

    return {
      budget,
      used: totalSalary,
      remaining: budget - totalSalary,
      utilization: budget > 0 ? (totalSalary / budget) * 100 : 0,
      employeeCount: employees.length
    };
  }
}

module.exports = new DepartmentModel();