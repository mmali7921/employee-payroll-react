import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeesAPI } from '../services/api';

function EmployeeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const result = await employeesAPI.getById(id);
      if (result.success) {
        setEmployee(result.data);
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

  if (!employee) {
    return (
      <div className="page-container">
        <div className="error-message">
          <span className="error-icon">❌</span>
          Employee not found
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
          <h1 className="page-title">Employee Details</h1>
          <p className="page-subtitle">View employee information</p>
        </div>
        <div className="page-actions">
          <Link to={`/employees/${id}/edit`} className="btn btn-primary">
            Edit Employee
          </Link>
          <button onClick={() => navigate('/employees')} className="btn btn-secondary">
            Back to Employees
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="employee-profile">
          <div className="profile-header">
            <div className="profile-avatar">
              {employee.emp_name.charAt(0)}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{employee.emp_name}</h2>
              <p className="profile-position">{employee.position}</p>
              <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                {employee.status}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Employee ID:</span>
                  <span className="detail-value">{employee.emp_id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{employee.emp_mail_id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{employee.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{employee.address || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Work Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{employee.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Position:</span>
                  <span className="detail-value">{employee.position}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Salary:</span>
                  <span className="detail-value">${parseFloat(employee.salary).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hire Date:</span>
                  <span className="detail-value">{new Date(employee.hire_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Emergency Contact</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Contact Name:</span>
                  <span className="detail-value">{employee.emergency_contact || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contact Phone:</span>
                  <span className="detail-value">{employee.emergency_phone || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeViewPage;



