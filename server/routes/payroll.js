const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const { authenticateToken, requireHR, logAction } = require('../middleware/auth');
const Joi = require('joi');

// Validation schema for payroll generation
const payrollSchema = Joi.object({
  period: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  employee_ids: Joi.array().items(Joi.number().integer().positive()).optional()
});

// Calculate payroll for a single employee
const calculatePayroll = (employee, period) => {
  const baseSalary = parseFloat(employee.salary) || 0;
  const overtimeHours = 0; // Could be tracked separately
  const overtimeRate = 1.5;
  const overtimePay = overtimeHours * (baseSalary / 160) * overtimeRate; // Assuming 160 hours/month
  
  // Tax calculations (simplified)
  const federalTaxRate = 0.22; // 22% federal tax
  const stateTaxRate = 0.05;   // 5% state tax
  const socialSecurityRate = 0.062; // 6.2% social security
  const medicareRate = 0.0145; // 1.45% medicare
  
  const grossPay = baseSalary + overtimePay;
  const federalTax = grossPay * federalTaxRate;
  const stateTax = grossPay * stateTaxRate;
  const socialSecurity = grossPay * socialSecurityRate;
  const medicare = grossPay * medicareRate;
  
  const totalDeductions = federalTax + stateTax + socialSecurity + medicare;
  const netPay = grossPay - totalDeductions;
  
  return {
    employee_id: employee.emp_id,
    period,
    base_salary: baseSalary,
    overtime_hours: overtimeHours,
    overtime_pay: overtimePay,
    gross_pay: grossPay,
    federal_tax: federalTax,
    state_tax: stateTax,
    social_security: socialSecurity,
    medicare: medicare,
    total_deductions: totalDeductions,
    net_pay: netPay,
    status: 'Pending'
  };
};

// GET /api/payroll - Get payroll data
router.get('/', authenticateToken, logAction, async (req, res) => {
  try {
    const { period, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, e.emp_name, e.department 
      FROM payroll p 
      JOIN employees e ON p.employee_id = e.emp_id 
      WHERE 1=1
    `;
    const params = [];

    if (period) {
      query += ` AND p.period = ?`;
      params.push(period);
    }

    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payroll data',
        error: result.error
      });
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM payroll p 
      WHERE 1=1 ${period ? 'AND p.period = ?' : ''} ${status ? 'AND p.status = ?' : ''}
    `;
    const countParams = [];
    if (period) countParams.push(period);
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
    console.error('Error fetching payroll:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/payroll/generate - Generate payroll for period
router.post('/generate', authenticateToken, requireHR, logAction, async (req, res) => {
  try {
    const { error, value } = payrollSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { period, employee_ids } = value;

    // Check if payroll already exists for this period
    const existingPayroll = await executeQuery(
      'SELECT COUNT(*) as count FROM payroll WHERE period = ?',
      [period]
    );

    if (existingPayroll.success && existingPayroll.data[0].count > 0) {
      return res.status(409).json({
        success: false,
        message: 'Payroll already exists for this period'
      });
    }

    // Get employees to process
    let employeesQuery = 'SELECT * FROM employees WHERE status = "Active"';
    const employeesParams = [];

    if (employee_ids && employee_ids.length > 0) {
      employeesQuery += ' AND emp_id IN (' + employee_ids.map(() => '?').join(',') + ')';
      employeesParams.push(...employee_ids);
    }

    const employeesResult = await executeQuery(employeesQuery, employeesParams);

    if (!employeesResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch employees',
        error: employeesResult.error
      });
    }

    if (employeesResult.data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active employees found'
      });
    }

    // Calculate payroll for each employee
    const payrollData = employeesResult.data.map(employee => 
      calculatePayroll(employee, period)
    );

    // Insert payroll data
    const insertPromises = payrollData.map(payroll => 
      executeQuery(
        `INSERT INTO payroll (employee_id, period, base_salary, overtime_hours, overtime_pay, 
         gross_pay, federal_tax, state_tax, social_security, medicare, total_deductions, net_pay, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payroll.employee_id, payroll.period, payroll.base_salary, payroll.overtime_hours,
          payroll.overtime_pay, payroll.gross_pay, payroll.federal_tax, payroll.state_tax,
          payroll.social_security, payroll.medicare, payroll.total_deductions, payroll.net_pay,
          payroll.status
        ]
      )
    );

    const insertResults = await Promise.all(insertPromises);
    const failedInserts = insertResults.filter(result => !result.success);

    if (failedInserts.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate payroll for some employees',
        errors: failedInserts.map(result => result.error)
      });
    }

    const totalAmount = payrollData.reduce((sum, payroll) => sum + payroll.net_pay, 0);

    res.status(201).json({
      success: true,
      message: 'Payroll generated successfully',
      data: {
        period,
        employee_count: payrollData.length,
        total_amount: totalAmount,
        payroll_data: payrollData
      }
    });

  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/payroll/process - Process payroll (mark as processed)
router.put('/process', authenticateToken, requireHR, logAction, async (req, res) => {
  try {
    const { period } = req.body;

    if (!period) {
      return res.status(400).json({
        success: false,
        message: 'Period is required'
      });
    }

    // Update payroll status to processed
    const result = await executeQuery(
      'UPDATE payroll SET status = "Processed", processed_at = CURRENT_TIMESTAMP WHERE period = ? AND status = "Pending"',
      [period]
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to process payroll',
        error: result.error
      });
    }

    // Get updated payroll data
    const updatedPayroll = await executeQuery(
      'SELECT * FROM payroll WHERE period = ?',
      [period]
    );

    const totalAmount = updatedPayroll.data.reduce((sum, payroll) => sum + payroll.net_pay, 0);

    res.json({
      success: true,
      message: 'Payroll processed successfully',
      data: {
        period,
        processed_count: result.data.affectedRows,
        total_amount: totalAmount
      }
    });

  } catch (error) {
    console.error('Error processing payroll:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/payroll/summary - Get payroll summary
router.get('/summary', authenticateToken, logAction, async (req, res) => {
  try {
    const { period } = req.query;

    let query = `
      SELECT 
        COUNT(*) as total_employees,
        SUM(net_pay) as total_payroll,
        AVG(net_pay) as average_pay,
        SUM(CASE WHEN status = 'Processed' THEN 1 ELSE 0 END) as processed_count,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_count
      FROM payroll
    `;
    const params = [];

    if (period) {
      query += ' WHERE period = ?';
      params.push(period);
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payroll summary',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data[0]
    });

  } catch (error) {
    console.error('Error fetching payroll summary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
