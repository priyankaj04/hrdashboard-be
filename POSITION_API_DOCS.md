# Position API Endpoints

This document describes the Position API endpoints that have been created for the HR Dashboard backend.

## Base URL
```
http://localhost:5000/api/positions
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Positions
**GET** `/api/positions`

Retrieves all positions with department information.

**Query Parameters:**
- `include_stats=true` - Include employee count statistics
- `include_department=true` - Include department information (default: true)

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/positions?include_stats=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Software Engineer",
      "department_id": "dept-uuid",
      "description": "Develop and maintain software applications",
      "min_salary": 80000,
      "max_salary": 120000,
      "salary_currency": "USD",
      "employment_type": "full-time",
      "department": {
        "id": "dept-uuid",
        "name": "Engineering",
        "code": "ENG"
      }
    }
  ],
  "message": "Positions retrieved successfully"
}
```

### 2. Get Positions by Department
**GET** `/api/positions/department/:departmentId`

Retrieves all positions for a specific department.

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/positions/department/f13e9674-2288-4a26-82ee-16b769f445d4
```

### 3. Get Position by ID
**GET** `/api/positions/:id`

Retrieves a specific position by its ID.

**Query Parameters:**
- `include_stats=true` - Include employee count statistics

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/positions/position-uuid?include_stats=true
```

### 4. Search Positions
**GET** `/api/positions/search`

Search positions by title or department name.

**Query Parameters:**
- `q` - Search term (minimum 2 characters)

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:5000/api/positions/search?q=engineer"
```

### 5. Get Positions by Salary Range
**GET** `/api/positions/salary-range`

Filter positions by salary range.

**Query Parameters:**
- `min_salary` - Minimum salary (optional)
- `max_salary` - Maximum salary (optional)

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:5000/api/positions/salary-range?min_salary=50000&max_salary=100000"
```

### 6. Create Position (Admin/HR Only)
**POST** `/api/positions`

Creates a new position.

**Required Body:**
```json
{
  "title": "Senior Software Engineer",
  "department_id": "dept-uuid",
  "description": "Lead software development projects",
  "responsibilities": "Design, develop, and mentor junior developers",
  "requirements": "5+ years experience, Bachelor's degree",
  "min_salary": 100000,
  "max_salary": 150000,
  "salary_currency": "USD",
  "employment_type": "full-time",
  "experience_level": "senior",
  "location_type": "hybrid"
}
```

### 7. Update Position (Admin/HR Only)
**PUT** `/api/positions/:id`

Updates an existing position.

### 8. Delete Position (Admin Only)
**DELETE** `/api/positions/:id`

Deletes a position.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Status Codes
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage with JavaScript

```javascript
// Get all positions
const positions = await fetch('/api/positions', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}).then(res => res.json());

// Get positions by department
const deptPositions = await fetch(`/api/positions/department/${departmentId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.json());

// Create new position (Admin/HR only)
const newPosition = await fetch('/api/positions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Junior Developer',
    department_id: 'dept-uuid',
    min_salary: 60000,
    max_salary: 80000
  })
}).then(res => res.json());
```