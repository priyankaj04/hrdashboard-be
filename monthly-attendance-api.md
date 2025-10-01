# Monthly Attendance API Documentation

## Get Monthly Attendance Data

### Endpoint
```
GET /api/attendance/monthly
```

### Description
Retrieves comprehensive attendance data for a specific month and year, including employee-wise breakdown, departmental filtering, and attendance statistics.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `month` | integer | Yes | Month number (1-12) |
| `year` | integer | Yes | Year (2020-current year + 1) |
| `department_id` | string | No | Filter by specific department UUID |
| `employee_id` | string | No | Filter by specific employee UUID |

### Example Requests

#### Get all employees for October 2024
```bash
GET /api/attendance/monthly?month=10&year=2024
```

#### Get specific department for October 2024
```bash
GET /api/attendance/monthly?month=10&year=2024&department_id=123e4567-e89b-12d3-a456-426614174000
```

#### Get specific employee for October 2024
```bash
GET /api/attendance/monthly?month=10&year=2024&employee_id=456e7890-e89b-12d3-a456-426614174001
```

### Response Format

```json
{
  "success": true,
  "data": {
    "month": 10,
    "year": 2024,
    "monthName": "October",
    "totalDays": 31,
    "totalWorkingDays": 23,
    "totalRecords": 460,
    "totalPresent": 420,
    "totalAbsent": 15,
    "totalLate": 18,
    "totalSick": 5,
    "totalVacation": 2,
    "totalHalfDay": 0,
    "overallAttendancePercentage": 91,
    "employees": [
      {
        "employeeId": "710b9f12-e085-4813-94e2-5f8f716a1c86",
        "employeeDetails": {
          "id": "710b9f12-e085-4813-94e2-5f8f716a1c86",
          "first_name": "John",
          "last_name": "Anderson",
          "employee_id": "EMP001",
          "department_id": "dept-123",
          "department": {
            "name": "Administration"
          }
        },
        "totalDays": 20,
        "presentDays": 18,
        "absentDays": 0,
        "lateDays": 2,
        "sickDays": 0,
        "vacationDays": 0,
        "halfDays": 0,
        "totalHours": 160.5,
        "overtimeHours": 8.5,
        "attendancePercentage": 78,
        "records": [
          {
            "id": "record-123",
            "employee_id": "710b9f12-e085-4813-94e2-5f8f716a1c86",
            "date": "2024-10-01",
            "check_in": "09:00:00",
            "check_out": "17:30:00",
            "break_start": "12:00:00",
            "break_end": "13:00:00",
            "status": "present",
            "location": "Office",
            "notes": null,
            "total_hours": 8.0,
            "overtime_hours": 0.0
          }
          // ... more records
        ]
      }
      // ... more employees
    ]
  }
}
```

### Response Fields

#### Summary Level
- `month`: Requested month number
- `year`: Requested year
- `monthName`: Month name in English
- `totalDays`: Total days in the month
- `totalWorkingDays`: Working days (excluding weekends)
- `totalRecords`: Total attendance records found
- `totalPresent`: Total present days across all employees
- `totalAbsent`: Total absent days across all employees
- `totalLate`: Total late days across all employees
- `totalSick`: Total sick days across all employees
- `totalVacation`: Total vacation days across all employees
- `totalHalfDay`: Total half days across all employees
- `overallAttendancePercentage`: Overall attendance percentage

#### Employee Level
- `employeeId`: Employee UUID
- `employeeDetails`: Employee information including name, employee ID, and department
- `totalDays`: Total attendance records for this employee
- `presentDays`: Days marked as present
- `absentDays`: Days marked as absent
- `lateDays`: Days marked as late
- `sickDays`: Days marked as sick
- `vacationDays`: Days marked as vacation
- `halfDays`: Days marked as half-day
- `totalHours`: Total hours worked
- `overtimeHours`: Total overtime hours
- `attendancePercentage`: Employee's attendance percentage for the month
- `records`: Array of detailed attendance records

### Status Codes

- `200`: Success
- `400`: Bad Request (invalid month/year parameters)
- `401`: Unauthorized
- `500`: Internal Server Error

### Error Response

```json
{
  "success": false,
  "error": "Month and year are required"
}
```

### Use Cases

1. **HR Dashboard**: Display monthly attendance overview for all employees
2. **Department Reports**: Generate department-specific attendance reports
3. **Employee Reviews**: Individual employee attendance analysis
4. **Payroll Processing**: Calculate working hours and overtime for salary processing
5. **Compliance Reporting**: Generate attendance reports for regulatory compliance

### Authentication
Requires valid JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```