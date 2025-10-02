const { supabaseAdmin } = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.supabase = supabaseAdmin;
  }

  // Get one record by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching ${this.tableName}: ${error.message}`);
    }

    return data;
  }

  async findByUserId(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching ${this.tableName}: ${error.message}`);
    }

    return data;

  }

  // Get all records with optional filters
  async findAll(filters = {}, columns = '*') {
    let query = this.supabase.from(this.tableName).select(columns);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching ${this.tableName}: ${error.message}`);
    }

    return data || [];
  }

  // Create a new record
  async create(data) {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating ${this.tableName}: ${error.message}`);
    }

    return result;
  }

  // Update a record by ID
  async update(id, data) {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating ${this.tableName}: ${error.message}`);
    }

    return result;
  }

  // Delete a record by ID
  async delete(id) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting ${this.tableName}: ${error.message}`);
    }

    return true;
  }

  // Get records with pagination
  async findWithPagination(page = 1, limit = 10, filters = {}, columns = '*') {
    const offset = (page - 1) * limit;
    
    let query = this.supabase.from(this.tableName).select(columns, { count: 'exact' });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching ${this.tableName}: ${error.message}`);
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  }
}

module.exports = BaseModel;