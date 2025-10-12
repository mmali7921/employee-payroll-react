import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeesAPI, departmentsAPI } from '../services/api';

function AddEmployeePage() {
  const [formData, setFormData] = useState({
    emp_name: '',
    emp_mail_id: '',
    department: '',
    position: '',
    salary: '',
    hire_date: '',
    phone: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const result = await departmentsAPI.getAll();
      if (result.success) {
        setDepartments(result.data);
      }
    } catch (err) {
      console.error('Error loading departments:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.emp_name.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }
    if (!formData.emp_mail_id.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emp_mail_id.trim())) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      setLoading(false);
      return;
    }
    if (!formData.department) {
      setError('Department is required');
      setLoading(false);
      return;
    }
    // Check if department exists in the loaded departments
    const departmentExists = departments.some(dept => dept.name === formData.department);
    if (!departmentExists) {
      setError('Please select a valid department');
      setLoading(false);
      return;
    }
    if (!formData.position.trim()) {
      setError('Position is required');
      setLoading(false);
      return;
    }
    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      setError('Valid salary is required (must be greater than 0)');
      setLoading(false);
      return;
    }
    // Check if salary is a valid number
    const salaryValue = parseFloat(formData.salary);
    if (isNaN(salaryValue)) {
      setError('Salary must be a valid number');
      setLoading(false);
      return;
    }
    if (!formData.hire_date) {
      setError('Hire date is required');
      setLoading(false);
      return;
    }

    try {
      // Format the data properly - only include required fields and non-empty optional fields
      const employeeData = {
        emp_name: formData.emp_name.trim(),
        emp_mail_id: formData.emp_mail_id.trim(),
        department: formData.department,
        position: formData.position.trim(),
        salary: parseFloat(formData.salary),
        hire_date: formData.hire_date,
        status: formData.status
      };

      // Only add optional fields if they have values
      if (formData.phone && formData.phone.trim()) {
        employeeData.phone = formData.phone.trim();
      }
      if (formData.address && formData.address.trim()) {
        employeeData.address = formData.address.trim();
      }
      if (formData.emergency_contact && formData.emergency_contact.trim()) {
        employeeData.emergency_contact = formData.emergency_contact.trim();
      }
      if (formData.emergency_phone && formData.emergency_phone.trim()) {
        employeeData.emergency_phone = formData.emergency_phone.trim();
      }

      const result = await employeesAPI.create(employeeData);
      if (result.success) {
        alert('Employee added successfully!');
        navigate('/employees');
      } else {
        // Handle validation errors specifically
        console.log('Error details:', result); // Debug log
        if (result.errors && Array.isArray(result.errors)) {
          setError(result.errors.join(', '));
        } else {
          setError(result.message || 'Failed to add employee');
        }
      }
    } catch (err) {
      setError('Failed to add employee');
      console.error('Error adding employee:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Add New Employee</h1>
          <p className="page-subtitle">Enter employee information</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="card-content">
            <form onSubmit={handleSubmit} className="form">
              {error && (
                <div className="error-message">
                  <span className="error-icon">❌</span>
                  {error}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emp_name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="emp_name"
                    name="emp_name"
                    value={formData.emp_name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emp_mail_id" className="form-label">Email *</label>
                  <input
                    type="email"
                    id="emp_mail_id"
                    name="emp_mail_id"
                    value={formData.emp_mail_id}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., john.doe@company.com"
                    required
                  />
                  <small className="form-hint">Enter a valid email address with domain extension. Email must be unique.</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department" className="form-label">Department *</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="position" className="form-label">Position *</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter job position"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salary" className="form-label">Salary *</label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter salary amount"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hire_date" className="form-label">Hire Date *</label>
                  <input
                    type="date"
                    id="hire_date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter address"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emergency_contact" className="form-label">Emergency Contact</label>
                  <input
                    type="text"
                    id="emergency_contact"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergency_phone" className="form-label">Emergency Phone</label>
                  <input
                    type="tel"
                    id="emergency_phone"
                    name="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Emergency contact phone"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Adding Employee...' : 'Add Employee'}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/employees')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployeePage;
