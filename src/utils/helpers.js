// Response helper functions
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
};

// Date helpers
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const getCurrentDate = () => {
  return formatDate(new Date());
};

const getCurrentTime = () => {
  return new Date().toISOString().split('T')[1].split('.')[0];
};

// Validation helpers
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Salary helpers
const calculateMonthlyFromAnnual = (annualSalary) => {
  return annualSalary / 12;
};

const calculateAnnualFromMonthly = (monthlySalary) => {
  return monthlySalary * 12;
};

const calculateHourlyFromAnnual = (annualSalary, hoursPerWeek = 40) => {
  return annualSalary / (hoursPerWeek * 52);
};

// Time helpers
const calculateWorkingHours = (checkIn, checkOut, breakDuration = 0) => {
  if (!checkIn || !checkOut) return 0;
  
  const start = new Date(`1970-01-01T${checkIn}`);
  const end = new Date(`1970-01-01T${checkOut}`);
  
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return Math.max(0, diffHours - (breakDuration / 60));
};

const isLateCheckIn = (checkIn, scheduledStart, gracePeriod = 15) => {
  if (!checkIn || !scheduledStart) return false;
  
  const actual = new Date(`1970-01-01T${checkIn}`);
  const scheduled = new Date(`1970-01-01T${scheduledStart}`);
  
  const graceTime = new Date(scheduled.getTime() + gracePeriod * 60000);
  
  return actual > graceTime;
};

// Array helpers
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

const sortBy = (array, key, direction = 'asc') => {
  return array.sort((a, b) => {
    if (direction === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

// String helpers
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatName = (firstName, lastName) => {
  return `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
};

// Export all utilities
module.exports = {
  // Response helpers
  successResponse,
  errorResponse,
  paginatedResponse,
  
  // Date helpers
  formatDate,
  getCurrentDate,
  getCurrentTime,
  
  // Validation helpers
  isValidUUID,
  isValidEmail,
  
  // Salary helpers
  calculateMonthlyFromAnnual,
  calculateAnnualFromMonthly,
  calculateHourlyFromAnnual,
  
  // Time helpers
  calculateWorkingHours,
  isLateCheckIn,
  
  // Array helpers
  groupBy,
  sortBy,
  
  // String helpers
  capitalizeFirstLetter,
  formatName
};