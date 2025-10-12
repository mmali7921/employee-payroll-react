import React, { useState, useEffect } from 'react';
import { departmentsAPI } from '../services/api';

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    manager: '',
    budget: ''
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await departmentsAPI.getAll();
      if (result.success) {
        setDepartments(result.data);
      } else {
        setError(result.message || 'Failed to load departments');
      }
    } catch (err) {
      console.error('Error loading departments:', err);
      setError('Unable to load departments. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const result = await departmentsAPI.create(newDepartment);
      if (result.success) {
        loadDepartments(); // Reload the list
        setShowAddForm(false);
        setNewDepartment({ name: '', manager: '', budget: '' });
        setError(null);
      } else {
        setError(result.message || 'Failed to add department');
      }
    } catch (err) {
      setError('Failed to add department');
      console.error('Error adding department:', err);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const result = await departmentsAPI.delete(id);
        if (result.success) {
          loadDepartments(); // Reload the list
        } else {
          setError(result.message || 'Failed to delete department');
        }
      } catch (err) {
        setError('Failed to delete department');
        console.error('Error deleting department:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewDepartment({
      ...newDepartment,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">Organize your workforce by departments</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <span>➕</span> Add Department
        </button>
      </div>

      <div className="page-content">
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <div className="error-content">
              <p>{error}</p>
              <button 
                onClick={loadDepartments} 
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '8px' }}
              >
                🔄 Retry
              </button>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading departments...</p>
          </div>
        ) : (
          <>
            {showAddForm && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Add New Department</h2>
                </div>
                <div className="card-content">
                  <form onSubmit={handleAddDepartment} className="form">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Department Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newDepartment.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter department name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="manager" className="form-label">Manager</label>
                      <input
                        type="text"
                        id="manager"
                        name="manager"
                        value={newDepartment.manager}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter manager name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="budget" className="form-label">Budget</label>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={newDepartment.budget}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter budget amount"
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        Add Department
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddForm(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="departments-grid">
              {departments.map((dept) => (
                <div key={dept.id} className="department-card">
                  <div className="department-header">
                    <h3 className="department-name">{dept.name}</h3>
                    <button 
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="delete-btn"
                      title="Delete department"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="department-info">
                    <div className="info-item">
                      <span className="info-label">Manager:</span>
                      <span className="info-value">{dept.manager}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Employees:</span>
                      <span className="info-value">{dept.employee_count || 0}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Budget:</span>
                      <span className="info-value">${dept.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DepartmentsPage;
