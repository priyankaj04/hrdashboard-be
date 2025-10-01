const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  // Find user by email
  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .ilike('email', '%'+email+'%')
      .single();

      console.log("data", email, data, this.tableName)

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  }

  // Get users by role
  async findByRole(role) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('role', role)
      .eq('is_active', true);

    if (error) {
      throw new Error(`Error fetching users by role: ${error.message}`);
    }

    return data || [];
  }

  // Update last login
  async updateLastLogin(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ last_login: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }

    return data;
  }

  // Activate/Deactivate user
  async updateStatus(id, isActive) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating user status: ${error.message}`);
    }

    return data;
  }

  // Get active users only
  async findActiveUsers() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true);

    if (error) {
      throw new Error(`Error fetching active users: ${error.message}`);
    }

    return data || [];
  }
}

module.exports = new UserModel();