const BaseModel = require('./BaseModel');

class PositionModel extends BaseModel {
    constructor() {
        super('positions');
    }

    // Get positions by department
    async findByDepartment(departmentId) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select('*')
            .eq('department_id', departmentId)
            .eq('is_active', true);

        if (error) {
            throw new Error(`Error fetching positions by department: ${error.message}`);
        }

        return data || [];
    }

    // Get all active positions
    async findAllActive() {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select('*')
            .eq('is_active', true);

        if (error) {
            throw new Error(`Error fetching positions: ${error.message}`);
        }

        return data || [];
    }
}

class LeaveTypeModel extends BaseModel {
  constructor() {
    super('leave_types');
  }

  // Get active leave types
  async findActiveTypes() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw new Error(`Error fetching leave types: ${error.message}`);
    }

    return data || [];
  }
}

class NotificationModel extends BaseModel {
  constructor() {
    super('notifications');
  }

  // Get notifications for user
  async findByUser(userId, unreadOnly = false) {
    let query = this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Error fetching notifications: ${error.message}`);
    }

    return data || [];
  }

  // Mark notification as read
  async markAsRead(id, userId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error marking notification as read: ${error.message}`);
    }

    return data;
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error(`Error marking all notifications as read: ${error.message}`);
    }

    return data;
  }

  // Create notification
  async createNotification(notification) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(notification)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }

    return data;
  }
}

module.exports = {
  PositionModel: new PositionModel(),
  LeaveTypeModel: new LeaveTypeModel(),
  NotificationModel: new NotificationModel()
};