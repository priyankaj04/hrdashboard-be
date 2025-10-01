const PositionModel = require('../models/PositionModel');
const { validationResult } = require('express-validator');

class PositionController {
  constructor() {
    this.positionModel = new PositionModel();
  }

  // Get all positions
  getAllPositions = async (req, res) => {
    try {
      const { include_stats, include_department } = req.query;
      let positions;

      if (include_stats === 'true') {
        positions = await this.positionModel.findAllWithStats();
      } else if (include_department === 'true' || include_department === undefined) {
        // Include department by default
        positions = await this.positionModel.findAllWithDepartment();
      } else {
        positions = await this.positionModel.findAll();
      }

      res.json({
        success: true,
        data: positions,
        message: 'Positions retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching positions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch positions',
        error: error.message
      });
    }
  };

  // Get positions by department ID
  getPositionsByDepartment = async (req, res) => {
    try {
      const { departmentId } = req.params;
      
      if (!departmentId) {
        return res.status(400).json({
          success: false,
          message: 'Department ID is required'
        });
      }

      const positions = await this.positionModel.findByDepartmentId(departmentId);

      res.json({
        success: true,
        data: positions,
        message: 'Positions retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching positions by department:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch positions by department',
        error: error.message
      });
    }
  };

  // Get position by ID
  getPositionById = async (req, res) => {
    try {
      const { id } = req.params;
      const { include_stats } = req.query;

      let position;
      if (include_stats === 'true') {
        position = await this.positionModel.findByIdWithStats(id);
      } else {
        position = await this.positionModel.findById(id);
      }

      if (!position) {
        return res.status(404).json({
          success: false,
          message: 'Position not found'
        });
      }

      res.json({
        success: true,
        data: position,
        message: 'Position retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching position:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch position',
        error: error.message
      });
    }
  };

  // Search positions
  searchPositions = async (req, res) => {
    try {
      const { q: searchTerm } = req.query;

      if (!searchTerm || searchTerm.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search term must be at least 2 characters long'
        });
      }

      const positions = await this.positionModel.search(searchTerm.trim());

      res.json({
        success: true,
        data: positions,
        message: 'Search completed successfully',
        count: positions.length
      });
    } catch (error) {
      console.error('Error searching positions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search positions',
        error: error.message
      });
    }
  };

  // Get positions by salary range
  getPositionsBySalaryRange = async (req, res) => {
    try {
      const { min_salary, max_salary } = req.query;

      // Validate salary values
      if (min_salary && isNaN(min_salary)) {
        return res.status(400).json({
          success: false,
          message: 'Minimum salary must be a valid number'
        });
      }

      if (max_salary && isNaN(max_salary)) {
        return res.status(400).json({
          success: false,
          message: 'Maximum salary must be a valid number'
        });
      }

      if (min_salary && max_salary && parseFloat(min_salary) > parseFloat(max_salary)) {
        return res.status(400).json({
          success: false,
          message: 'Minimum salary cannot be greater than maximum salary'
        });
      }

      const positions = await this.positionModel.findBySalaryRange(
        min_salary ? parseFloat(min_salary) : null,
        max_salary ? parseFloat(max_salary) : null
      );

      res.json({
        success: true,
        data: positions,
        message: 'Positions retrieved successfully',
        filters: {
          min_salary: min_salary ? parseFloat(min_salary) : null,
          max_salary: max_salary ? parseFloat(max_salary) : null
        }
      });
    } catch (error) {
      console.error('Error fetching positions by salary range:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch positions by salary range',
        error: error.message
      });
    }
  };

  // Create new position
  createPosition = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const positionData = req.body;
      const position = await this.positionModel.create(positionData);

      res.status(201).json({
        success: true,
        data: position,
        message: 'Position created successfully'
      });
    } catch (error) {
      console.error('Error creating position:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create position',
        error: error.message
      });
    }
  };

  // Update position
  updatePosition = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      const position = await this.positionModel.update(id, updateData);

      if (!position) {
        return res.status(404).json({
          success: false,
          message: 'Position not found'
        });
      }

      res.json({
        success: true,
        data: position,
        message: 'Position updated successfully'
      });
    } catch (error) {
      console.error('Error updating position:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update position',
        error: error.message
      });
    }
  };

  // Delete position
  deletePosition = async (req, res) => {
    try {
      const { id } = req.params;

      const success = await this.positionModel.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Position not found'
        });
      }

      res.json({
        success: true,
        message: 'Position deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting position:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete position',
        error: error.message
      });
    }
  };
}

module.exports = new PositionController();