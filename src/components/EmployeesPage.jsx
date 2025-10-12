import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeesAPI } from '../services/api';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await employeesAPI.getAll();
      if (result.success) {
        setEmployees(result.data);
      } else {
        setError(result.message || 'Failed to load employees');
      }
    } catch (err) {
      console.error('Error loading employees:', err);
      setError('Unable to load employees. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const result = await employeesAPI.delete(id);
        if (result.success) {
          loadEmployees(); // Reload the list
        } else {
          setError(result.message || 'Failed to delete employee');
        }
      } catch (err) {
        setError('Failed to delete employee');
        console.error('Error deleting employee:', err);
      }
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.emp_mail_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">Manage your workforce</p>
        </div>
        <Link to="/employees/add" className="btn btn-primary">
          <span>➕</span> Add Employee
        </Link>
      </div>

      <div className="page-content">
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <div className="error-content">
              <p>{error}</p>
              <button 
                onClick={loadEmployees} 
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '8px' }}
              >
                🔄 Retry
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Table */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading employees...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.emp_id}>
                    <td>
                      <div className="employee-info">
                        <div className="employee-avatar">
                          {employee.emp_name.charAt(0)}
                        </div>
                        <div className="employee-details">
                          <div className="employee-name">{employee.emp_name}</div>
                          <div className="employee-id">ID: {employee.emp_id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{employee.emp_mail_id}</td>
                    <td>
                      <span className="department-badge">{employee.department}</span>
                    </td>
                    <td>{employee.position}</td>
                    <td>${parseFloat(employee.salary).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/employees/${employee.emp_id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/employees/${employee.emp_id}/edit`}
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteEmployee(employee.emp_id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEmployees.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No employees found</h3>
                <p>Try adjusting your search criteria or add a new employee.</p>
                <Link to="/employees/add" className="btn btn-primary">
                  Add Employee
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeesPage;
