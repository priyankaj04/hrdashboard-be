# HR Dashboard Backend - Quick Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Supabase account and project

## Step 1: Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Configure your Supabase credentials in `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```

## Step 2: Database Setup

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the `database/supabase-schema.sql` file to create all tables
4. Run the `database/sample-data.sql` file to insert sample data

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Step 5: Test the API

The server will start on `http://localhost:8000`

### Health Check
```bash
curl http://localhost:8000/health
```

### API Documentation
Visit: `http://localhost:8000/api`

### Login (using sample data)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@company.com", "password": "password123"}'
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin/HR)
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee (Admin only)

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department (Admin/HR)
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department (Admin only)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/summary/:employeeId` - Get attendance summary

## Sample User Accounts

From the sample data:

| Email | Password | Role |
|-------|----------|------|
| admin@company.com | password123 | admin |
| hr@company.com | password123 | hr |
| employee@company.com | password123 | employee |

## Authentication

All protected endpoints require a Bearer token:

```bash
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error info"]
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

## Support

For issues or questions, check the README.md file or contact the development team.