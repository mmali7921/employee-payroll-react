const { executeQuery, testConnection } = require('../config/database');
require('dotenv').config({ path: './config.env' });

const createTables = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Create employees table
    const employeesTable = `
      CREATE TABLE IF NOT EXISTS employees (
        emp_id INT AUTO_INCREMENT PRIMARY KEY,
        emp_name VARCHAR(255) NOT NULL,
        emp_mail_id VARCHAR(255) UNIQUE NOT NULL,
        department VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        salary DECIMAL(10,2) NOT NULL,
        hire_date DATE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        emergency_contact VARCHAR(255),
        emergency_phone VARCHAR(20),
        status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Create departments table
    const departmentsTable = `
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        manager VARCHAR(255) NOT NULL,
        employee_count INT DEFAULT 0,
        budget DECIMAL(12,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Create payroll table
    const payrollTable = `
      CREATE TABLE IF NOT EXISTS payroll (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        period VARCHAR(10) NOT NULL,
        base_salary DECIMAL(10,2) NOT NULL,
        overtime_hours DECIMAL(5,2) DEFAULT 0,
        overtime_pay DECIMAL(10,2) DEFAULT 0,
        gross_pay DECIMAL(10,2) NOT NULL,
        federal_tax DECIMAL(10,2) NOT NULL,
        state_tax DECIMAL(10,2) NOT NULL,
        social_security DECIMAL(10,2) NOT NULL,
        medicare DECIMAL(10,2) NOT NULL,
        total_deductions DECIMAL(10,2) NOT NULL,
        net_pay DECIMAL(10,2) NOT NULL,
        status ENUM('Pending', 'Processed', 'Cancelled') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL,
        FOREIGN KEY (employee_id) REFERENCES employees(emp_id) ON DELETE CASCADE
      )
    `;

    // Create audit_logs table
    const auditLogsTable = `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        details JSON,
        user_name VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45)
      )
    `;

    // Create users table for authentication
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'hr', 'employee') DEFAULT 'employee',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Execute table creation queries
    await executeQuery(employeesTable);
    console.log('✅ Employees table created');

    await executeQuery(departmentsTable);
    console.log('✅ Departments table created');

    await executeQuery(payrollTable);
    console.log('✅ Payroll table created');

    await executeQuery(auditLogsTable);
    console.log('✅ Audit logs table created');

    await executeQuery(usersTable);
    console.log('✅ Users table created');

    // Insert sample data
    await insertSampleData();

    console.log('🎉 Database migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  try {
    console.log('📝 Inserting sample data...');

    // Insert sample departments
    const departments = [
      ['Engineering', 'John Smith', 25, 500000],
      ['Marketing', 'Sarah Johnson', 12, 200000],
      ['HR', 'Mike Wilson', 8, 150000],
      ['Finance', 'Lisa Brown', 15, 300000],
      ['Sales', 'David Lee', 20, 400000]
    ];

    for (const dept of departments) {
      await executeQuery(
        'INSERT IGNORE INTO departments (name, manager, employee_count, budget) VALUES (?, ?, ?, ?)',
        dept
      );
    }

    // Insert sample employees
    const employees = [
      ['John Doe', 'john@example.com', 'Engineering', 'Senior Developer', 85000, '2022-01-15', '+1 (555) 123-4567', '123 Main St, City, State 12345', 'Jane Doe', '+1 (555) 987-6543', 'Active'],
      ['Jane Smith', 'jane@example.com', 'Marketing', 'Marketing Manager', 75000, '2021-08-20', '+1 (555) 234-5678', '456 Oak Ave, City, State 12345', 'Bob Smith', '+1 (555) 876-5432', 'Active'],
      ['Mike Johnson', 'mike@example.com', 'HR', 'HR Specialist', 65000, '2023-03-10', '+1 (555) 345-6789', '789 Pine St, City, State 12345', 'Lisa Johnson', '+1 (555) 765-4321', 'Active']
    ];

    for (const emp of employees) {
      await executeQuery(
        'INSERT IGNORE INTO employees (emp_name, emp_mail_id, department, position, salary, hire_date, phone, address, emergency_contact, emergency_phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        emp
      );
    }

    // Insert default admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await executeQuery(
      'INSERT IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@company.com', hashedPassword, 'admin']
    );

    console.log('✅ Sample data inserted successfully');
  } catch (error) {
    console.error('❌ Failed to insert sample data:', error.message);
  }
};

// Run migration
createTables();
