const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { createPositionSchema, updatePositionSchema } = require('../utils/validation');

// Public routes (with authentication but minimal authorization)
/**
 * @route GET /api/positions
 * @desc Get all positions
 * @access Private
 * @query {boolean} include_stats - Include employee count statistics
 * @query {boolean} include_department - Include department information (default: true)
 */
router.get('/', authenticate, positionController.getAllPositions);

/**
 * @route GET /api/positions/department/:departmentId
 * @desc Get positions by department ID
 * @access Private
 */
router.get('/department/:departmentId', authenticate, positionController.getPositionsByDepartment);

/**
 * @route GET /api/positions/search
 * @desc Search positions by title or department
 * @access Private
 * @query {string} q - Search term (minimum 2 characters)
 */
router.get('/search', authenticate, positionController.searchPositions);

/**
 * @route GET /api/positions/salary-range
 * @desc Get positions by salary range
 * @access Private
 * @query {number} min_salary - Minimum salary
 * @query {number} max_salary - Maximum salary
 */
router.get('/salary-range', authenticate, positionController.getPositionsBySalaryRange);

/**
 * @route GET /api/positions/:id
 * @desc Get position by ID
 * @access Private
 * @query {boolean} include_stats - Include employee count statistics
 */
router.get('/:id', authenticate, positionController.getPositionById);

// Admin/HR only routes
/**
 * @route POST /api/positions
 * @desc Create new position
 * @access Private (Admin/HR only)
 */
router.post('/', 
  authenticate, 
  authorize(['admin', 'hr']), 
  validate(createPositionSchema), 
  positionController.createPosition
);

/**
 * @route PUT /api/positions/:id
 * @desc Update position
 * @access Private (Admin/HR only)
 */
router.put('/:id', 
  authenticate, 
  authorize(['admin', 'hr']), 
  validate(updatePositionSchema), 
  positionController.updatePosition
);

/**
 * @route DELETE /api/positions/:id
 * @desc Delete position
 * @access Private (Admin only)
 */
router.delete('/:id', 
  authenticate, 
  authorize(['admin']), 
  positionController.deletePosition
);

module.exports = router;