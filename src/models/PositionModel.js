const BaseModel = require('./BaseModel');

class PositionModel extends BaseModel {
  constructor() {
    super('positions');
  }

  // Get all positions with department information
  async findAllWithDepartment() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        department:departments(id, name)
      `)
      .order('department_id, title');

    if (error) {
      throw new Error(`Error fetching positions: ${error.message}`);
    }

    return data;
  }

  // Get positions by department ID
  async findByDepartmentId(departmentId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        department:departments(id, name)
      `)
      .eq('department_id', departmentId)
      .order('title');

    if (error) {
      throw new Error(`Error fetching positions by department: ${error.message}`);
    }

    return data;
  }

  // Get position with department info and employee count
  async findByIdWithStats(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        department:departments(id, name),
        employee_count:employees(count)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching position: ${error.message}`);
    }

    return data;
  }

  // Get positions with employee counts
  async findAllWithStats() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        department:departments(id, name),
        employees(count)
      `)
      .order('department_id, title');

    if (error) {
      throw new Error(`Error fetching positions with stats: ${error.message}`);
    }

    return data;
  }

  // Search positions by title or department
  async search(searchTerm) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        department:departments(id, name)
      `)
      .or(`title.ilike.%${searchTerm}%,department.name.ilike.%${searchTerm}%`)
      .order('title');

    if (error) {
      throw new Error(`Error searching positions: ${error.message}`);
    }

    return data;
  }

  // Get positions by salary range
  async findBySalaryRange(minSalary, maxSalary) {
    let query = this.supabase
      .from(this.tableName)
      .select(`
        *,
        department:departments(id, name)
      `);

    if (minSalary) {
      query = query.gte('min_salary', minSalary);
    }
    if (maxSalary) {
      query = query.lte('max_salary', maxSalary);
    }

    const { data, error } = await query.order('min_salary');

    if (error) {
      throw new Error(`Error fetching positions by salary range: ${error.message}`);
    }

    return data;
  }
}

module.exports = PositionModel;