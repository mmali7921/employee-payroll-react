import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeesAPI, departmentsAPI } from '../services/api';

function EmployeeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadEmployee();
    loadDepartments();
  }, [id]);

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

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const result = await employeesAPI.getById(id);
      if (result.success) {
        setFormData({
          emp_name: result.data.emp_name || '',
          emp_mail_id: result.data.emp_mail_id || '',
          department: result.data.department || '',
          position: result.data.position || '',
          salary: result.data.salary || '',
          hire_date: result.data.hire_date ? result.data.hire_date.split('T')[0] : '',
          phone: result.data.phone || '',
          address: result.data.address || '',
          emergency_contact: result.data.emergency_contact || '',
          emergency_phone: result.data.emergency_phone || '',
          status: result.data.status || 'Active'
        });
        setError(null);
      } else {
        setError(result.message || 'Failed to load employee');
      }
    } catch (err) {
      setError('Failed to load employee');
      console.error('Error loading employee:', err);
    } finally {
      setLoading(false);
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
    setSaving(true);
    setError('');

    // Basic validation
    if (!formData.emp_name.trim()) {
      setError('Full name is required');
      setSaving(false);
      return;
    }
    if (!formData.emp_mail_id.trim()) {
      setError('Email is required');
      setSaving(false);
      return;
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emp_mail_id.trim())) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      setSaving(false);
      return;
    }
    if (!formData.department) {
      setError('Department is required');
      setSaving(false);
      return;
    }
    if (!formData.position.trim()) {
      setError('Position is required');
      setSaving(false);
      return;
    }
    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      setError('Valid salary is required');
      setSaving(false);
      return;
    }
    if (!formData.hire_date) {
      setError('Hire date is required');
      setSaving(false);
      return;
    }

    try {
      // Format the data properly
      const employeeData = {
        ...formData,
        salary: parseFloat(formData.salary),
        emp_name: formData.emp_name.trim(),
        emp_mail_id: formData.emp_mail_id.trim(),
        position: formData.position.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        emergency_contact: formData.emergency_contact.trim() || null,
        emergency_phone: formData.emergency_phone.trim() || null
      };

      const result = await employeesAPI.update(id, employeeData);
      if (result.success) {
        alert('Employee updated successfully!');
        navigate(`/employees/${id}`);
      } else {
        // Handle validation errors specifically
        if (result.errors && Array.isArray(result.errors)) {
          setError(result.errors.join(', '));
        } else {
          setError(result.message || 'Failed to update employee');
        }
      }
    } catch (err) {
      setError('Failed to update employee');
      console.error('Error updating employee:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <span className="error-icon">❌</span>
          {error}
        </div>
        <button onClick={() => navigate('/employees')} className="btn btn-primary">
          Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Edit Employee</h1>
          <p className="page-subtitle">Update employee information</p>
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
                    placeholder="Enter email address"
                    required
                  />
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
                  className={`btn btn-primary ${saving ? 'loading' : ''}`}
                  disabled={saving}
                >
                  {saving ? 'Updating Employee...' : 'Update Employee'}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate(`/employees/${id}`)}
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

export default EmployeeEditPage;
