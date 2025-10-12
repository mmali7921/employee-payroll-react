const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const { authenticateToken, requireHR, logAction } = require('../middleware/auth');
const Joi = require('joi');

// Validation schemas
const departmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  manager: Joi.string().min(2).max(255).required(),
  budget: Joi.number().positive().required()
});

// GET /api/departments - Get all departments
router.get('/', authenticateToken, logAction, async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT d.*, 
             COUNT(e.emp_id) as employee_count
      FROM departments d
      LEFT JOIN employees e ON d.name = e.department AND e.status = 'Active'
      GROUP BY d.id
      ORDER BY d.name
    `);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch departments',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/departments - Create new department
router.post('/', authenticateToken, requireHR, logAction, async (req, res) => {
  try {
    const { error, value } = departmentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if department already exists
    const existingDepartment = await executeQuery(
      'SELECT id FROM departments WHERE name = ?',
      [value.name]
    );

    if (existingDepartment.success && existingDepartment.data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Department with this name already exists'
      });
    }

    const result = await executeQuery(
      'INSERT INTO departments (name, manager, budget) VALUES (?, ?, ?)',
      [value.name, value.manager, value.budget]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create department',
        error: result.error
      });
    }

    // Get the created department
    const newDepartment = await executeQuery(
      'SELECT * FROM departments WHERE id = ?',
      [result.data.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: newDepartment.data[0]
    });

  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/departments/:id - Update department
router.put('/:id', authenticateToken, requireHR, logAction, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = departmentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if department exists
    const existingDepartment = await executeQuery(
      'SELECT id FROM departments WHERE id = ?',
      [id]
    );

    if (!existingDepartment.success || existingDepartment.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if name already exists (excluding current department)
    const nameCheck = await executeQuery(
      'SELECT id FROM departments WHERE name = ? AND id != ?',
      [value.name, id]
    );

    if (nameCheck.success && nameCheck.data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Department with this name already exists'
      });
    }

    const result = await executeQuery(
      'UPDATE departments SET name = ?, manager = ?, budget = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [value.name, value.manager, value.budget, id]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update department',
        error: result.error
      });
    }

    // Get the updated department
    const updatedDepartment = await executeQuery(
      'SELECT * FROM departments WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment.data[0]
    });

  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/departments/:id - Delete department
router.delete('/:id', authenticateToken, requireHR, logAction, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if department exists
    const existingDepartment = await executeQuery(
      'SELECT id FROM departments WHERE id = ?',
      [id]
    );

    if (!existingDepartment.success || existingDepartment.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if department has employees
    const employeesInDept = await executeQuery(
      'SELECT COUNT(*) as count FROM employees WHERE department = (SELECT name FROM departments WHERE id = ?)',
      [id]
    );

    if (employeesInDept.success && employeesInDept.data[0].count > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete department with employees. Please reassign employees first.'
      });
    }

    const result = await executeQuery(
      'DELETE FROM departments WHERE id = ?',
      [id]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete department',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
