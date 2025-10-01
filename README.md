# HR Dashboard Backend

A comprehensive HR Dashboard backend built with Node.js, Express.js, and Supabase.

## Features

- **User Management**: Authentication and role-based access control
- **Employee Management**: Complete employee profiles and organizational structure  
- **Attendance Tracking**: Daily attendance records and work schedules
- **Leave Management**: Leave types, balances, and approval workflows
- **Payroll System**: Salary history and payroll processing
- **Performance Reviews**: Employee evaluations and training records
- **System Features**: Notifications, audit logs, and file attachments

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with Supabase Auth
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── server.js        # Main server file
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and configure:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   JWT_SECRET=your_jwt_secret
   PORT=8000
   NODE_ENV=development
   ```

3. **Database Setup**
   - Run the SQL scripts in the `database/` folder in your Supabase dashboard
   - First run `supabase-schema.sql`
   - Then run `sample-data.sql` for test data

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/:employeeId` - Get attendance for employee
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record

### Leave Management
- `GET /api/leaves` - Get leave requests
- `GET /api/leaves/:id` - Get leave request by ID
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Update leave request
- `PUT /api/leaves/:id/approve` - Approve leave request
- `PUT /api/leaves/:id/reject` - Reject leave request

### Payroll
- `GET /api/payroll` - Get payroll records
- `GET /api/payroll/:employeeId` - Get payroll for employee
- `POST /api/payroll` - Create payroll record

And more endpoints for all other entities...

## Environment Variables

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Configure all required environment variables
3. Run `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

MIT License