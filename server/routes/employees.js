const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const { authenticateToken, requireHR, logAction } = require('../middleware/auth');
const Joi = require('joi');

// Validation schemas
const employeeSchema = Joi.object({
  emp_name: Joi.string().min(2).max(255).required(),
  emp_mail_id: Joi.string().email().required(),
  department: Joi.string().max(100).required(),
  position: Joi.string().max(100).required(),
  salary: Joi.number().positive().required(),
  hire_date: Joi.date().required(),
  phone: Joi.string().max(20).optional().allow(''),
  address: Joi.string().optional().allow(''),
  emergency_contact: Joi.string().max(255).optional().allow(''),
  emergency_phone: Joi.string().max(20).optional().allow(''),
  status: Joi.string().valid('Active', 'Inactive', 'On Leave').default('Active')
});

// GET /api/employees - Get all employees
router.get('/', authenticateToken, logAction, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', department = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT emp_id, emp_name, emp_mail_id, department, position, salary, 
             hire_date, phone, address, emergency_contact, emergency_phone, 
             status, created_at, updated_at
      FROM employees 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (emp_name LIKE ? OR emp_mail_id LIKE ? OR position LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (department) {
      query += ` AND department = ?`;
      params.push(department);
    }

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch employees',
        error: result.error
      });
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM employees 
      WHERE 1=1 ${search ? 'AND (emp_name LIKE ? OR emp_mail_id LIKE ? OR position LIKE ?)' : ''}
      ${department ? 'AND department = ?' : ''}
      ${status ? 'AND status = ?' : ''}
    `;
    const countParams = [];
    if (search) countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    if (department) countParams.push(department);
    if (status) countParams.push(status);

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult.success ? countResult.data[0].total : 0;

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/employees/:id - Get employee by ID
router.get('/:id', authenticateToken, logAction, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(
      'SELECT * FROM employees WHERE emp_id = ?',
      [id]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch employee',
        error: result.error
      });
    }

    if (result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: result.data[0]
    });

  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/employees - Create new employee
router.post('/', authenticateToken, requireHR, logAction, async (req, res) => {
  try {
    const { error, value } = employeeSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if email already exists
    const existingEmployee = await executeQuery(
      'SELECT emp_id FROM employees WHERE emp_mail_id = ?',
      [value.emp_mail_id]
    );

    if (existingEmployee.success && existingEmployee.data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }

    const result = await executeQuery(
      `INSERT INTO employees (emp_name, emp_mail_id, department, position, salary, 
       hire_date, phone, address, emergency_contact, emergency_phone, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        value.emp_name, value.emp_mail_id, value.department, value.position,
        value.salary, value.hire_date, value.phone || null, value.address || null,
        value.emergency_contact || null, value.emergency_phone || null, value.status
      ]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create employee',
        error: result.error
      });
    }

    // Get the created employee
    const newEmployee = await executeQuery(
      'SELECT * FROM employees WHERE emp_id = ?',
      [result.data.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee.data[0]
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', authenticateToken, requireHR, logAction, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = employeeSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if employee exists
    const existingEmployee = await executeQuery(
      'SELECT emp_id FROM employees WHERE emp_id = ?',
      [id]
    );

    if (!existingEmployee.success || existingEmployee.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if email already exists (excluding current employee)
    const emailCheck = await executeQuery(
      'SELECT emp_id FROM employees WHERE emp_mail_id = ? AND emp_id != ?',
      [value.emp_mail_id, id]
    );

    if (emailCheck.success && emailCheck.data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }

    const result = await executeQuery(
      `UPDATE employees SET 
       emp_name = ?, emp_mail_id = ?, department = ?, position = ?, salary = ?,
       hire_date = ?, phone = ?, address = ?, emergency_contact = ?, 
       emergency_phone = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE emp_id = ?`,
      [
        value.emp_name, value.emp_mail_id, value.department, value.position,
        value.salary, value.hire_date, value.phone || null, value.address || null,
        value.emergency_contact || null, value.emergency_phone || null, value.status, id
      ]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update employee',
        error: result.error
      });
    }

    // Get the updated employee
    const updatedEmployee = await executeQuery(
      'SELECT * FROM employees WHERE emp_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee.data[0]
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', authenticateToken, requireHR, logAction, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const existingEmployee = await executeQuery(
      'SELECT emp_id FROM employees WHERE emp_id = ?',
      [id]
    );

    if (!existingEmployee.success || existingEmployee.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const result = await executeQuery(
      'DELETE FROM employees WHERE emp_id = ?',
      [id]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete employee',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
