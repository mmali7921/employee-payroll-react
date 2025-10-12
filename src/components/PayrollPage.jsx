import React, { useState, useEffect } from 'react';
import { payrollAPI } from '../services/api';
import HelpTooltip from './HelpTooltip';

function PayrollPage() {
  const [payrollData, setPayrollData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProcessForm, setShowProcessForm] = useState(false);

  useEffect(() => {
    loadPayrollData();
  }, [selectedPeriod]);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await payrollAPI.getAll({ period: selectedPeriod });
      if (result.success) {
        setPayrollData(result.data);
      } else {
        setError(result.message || 'Failed to load payroll data');
      }
    } catch (err) {
      console.error('Error loading payroll:', err);
      setError('Unable to load payroll data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      const result = await payrollAPI.generate(selectedPeriod);
      if (result.success) {
        loadPayrollData(); // Reload the data
        setError(null);
        alert('Payroll generated successfully!');
      } else {
        if (result.message && result.message.includes('already exists')) {
          setError('Payroll already exists for this period. Loading existing data...');
          loadPayrollData(); // Load existing payroll data
        } else {
          setError(result.message || 'Failed to generate payroll');
        }
      }
    } catch (err) {
      setError('Failed to generate payroll');
      console.error('Error generating payroll:', err);
    }
  };

  const handleProcessPayroll = async () => {
    try {
      const result = await payrollAPI.process(selectedPeriod);
      if (result.success) {
        loadPayrollData(); // Reload the data
        setShowProcessForm(false);
        setError(null);
      } else {
        setError(result.message || 'Failed to process payroll');
      }
    } catch (err) {
      setError('Failed to process payroll');
      console.error('Error processing payroll:', err);
    }
  };

  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.net_pay, 0);
  const processedCount = payrollData.filter(emp => emp.status === 'Processed').length;
  const pendingCount = payrollData.filter(emp => emp.status === 'Pending').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Payroll Management</h1>
          <p className="page-subtitle">Process and manage employee payroll</p>
        </div>
        <div className="page-actions">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
            <option value="2024-04">April 2024</option>
            <option value="2024-05">May 2024</option>
            <option value="2024-06">June 2024</option>
            <option value="2024-07">July 2024</option>
            <option value="2024-08">August 2024</option>
            <option value="2024-09">September 2024</option>
            <option value="2024-10">October 2024</option>
            <option value="2024-11">November 2024</option>
            <option value="2024-12">December 2024</option>
            <option value="2025-01">January 2025</option>
            <option value="2025-02">February 2025</option>
            <option value="2025-03">March 2025</option>
            <option value="2025-04">April 2025</option>
            <option value="2025-05">May 2025</option>
            <option value="2025-06">June 2025</option>
            <option value="2025-07">July 2025</option>
            <option value="2025-08">August 2025</option>
            <option value="2025-09">September 2025</option>
            <option value="2025-10">October 2025</option>
            <option value="2025-11">November 2025</option>
            <option value="2025-12">December 2025</option>
          </select>
          <HelpTooltip content="Generate payroll data for the selected period">
            <button 
              onClick={handleGeneratePayroll}
              className="btn btn-secondary"
            >
              Generate Payroll
            </button>
          </HelpTooltip>
          <HelpTooltip content="Process and finalize payroll for payment">
            <button 
              onClick={() => setShowProcessForm(true)}
              className="btn btn-primary"
              disabled={payrollData.length === 0}
            >
              Process Payroll
            </button>
          </HelpTooltip>
        </div>
      </div>

      <div className="page-content">
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <div className="error-content">
              <p>{error}</p>
              <button 
                onClick={loadPayrollData} 
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '8px' }}
              >
                🔄 Retry
              </button>
            </div>
          </div>
        )}

        {/* Payroll Summary */}
        <div className="payroll-summary">
          <div className="summary-card">
            <h3>Total Payroll</h3>
            <p className="summary-value">${totalPayroll.toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h3>Processed</h3>
            <p className="summary-value">{processedCount}</p>
          </div>
          <div className="summary-card">
            <h3>Pending</h3>
            <p className="summary-value">{pendingCount}</p>
          </div>
        </div>

        {/* Process Payroll Form */}
        {showProcessForm && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Process Payroll</h2>
            </div>
            <div className="card-content">
              <p>Are you sure you want to process payroll for {selectedPeriod}?</p>
              <div className="form-actions">
                <button 
                  onClick={handleProcessPayroll}
                  className="btn btn-primary"
                >
                  Confirm Process
                </button>
                <button 
                  onClick={() => setShowProcessForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payroll Table */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading payroll data...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Base Salary</th>
                  <th>Overtime</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((emp) => (
                  <tr key={emp.emp_id}>
                    <td>
                      <div className="employee-info">
                        <div className="employee-avatar">
                          {emp.emp_name.charAt(0)}
                        </div>
                        <div className="employee-details">
                          <div className="employee-name">{emp.emp_name}</div>
                          <div className="employee-id">ID: {emp.emp_id}</div>
                        </div>
                      </div>
                    </td>
                    <td>${emp.base_salary.toLocaleString()}</td>
                    <td>${emp.overtime_pay.toLocaleString()}</td>
                    <td>${emp.total_deductions.toLocaleString()}</td>
                    <td className="net-pay">${emp.net_pay.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${emp.status.toLowerCase()}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {payrollData.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <h3>No payroll data found</h3>
                <p>Generate payroll for the selected period to get started.</p>
                <button onClick={handleGeneratePayroll} className="btn btn-primary">
                  Generate Payroll
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PayrollPage;
