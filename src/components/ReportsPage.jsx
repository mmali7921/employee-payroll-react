import React, { useState, useEffect } from 'react';
import { employeesAPI, departmentsAPI, payrollAPI } from '../services/api';

function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [reportType, setReportType] = useState('overview');
  const [reportData, setReportData] = useState({
    overview: {
      totalEmployees: 0,
      totalDepartments: 0,
      totalPayroll: 0,
      averageSalary: 0,
      newHires: 0,
      departures: 0
    },
    payroll: {
      totalProcessed: 0,
      pending: 0,
      totalAmount: 0,
      averagePay: 0,
      overtime: 0,
      bonuses: 0
    },
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod, reportType]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Load employees
      const employeesResult = await employeesAPI.getAll();
      const employees = employeesResult.success ? employeesResult.data : [];
      
      // Load departments
      const departmentsResult = await departmentsAPI.getAll();
      const departments = departmentsResult.success ? departmentsResult.data : [];
      
      // Load payroll summary
      const payrollResult = await payrollAPI.getSummary(selectedPeriod);
      const payrollSummary = payrollResult.success ? payrollResult.data : {};

      // Calculate overview data
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
      const totalDepartments = departments.length;
      const totalPayroll = employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
      const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

      setReportData({
        overview: {
          totalEmployees,
          totalDepartments,
          totalPayroll,
          averageSalary,
          newHires: 0, // Could be calculated from hire dates
          departures: 0 // Could be calculated from status changes
        },
        payroll: {
          totalProcessed: payrollSummary.processed_count || 0,
          pending: payrollSummary.pending_count || 0,
          totalAmount: payrollSummary.total_payroll || 0,
          averagePay: payrollSummary.average_pay || 0,
          overtime: 0,
          bonuses: 0
        },
        departments: departments.map(dept => ({
          name: dept.name,
          employees: dept.employee_count || 0,
          budget: parseFloat(dept.budget) || 0,
          utilization: 85 // Could be calculated based on actual vs budget
        }))
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load report data');
      console.error('Error loading report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (type) => {
    console.log(`Exporting ${type} report for ${selectedPeriod}`);
    // Simulate export
    alert(`${type} report exported successfully!`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Generate insights and reports</p>
        </div>
        <div className="page-actions">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="report-type-selector"
          >
            <option value="overview">Overview</option>
            <option value="payroll">Payroll</option>
            <option value="departments">Departments</option>
            <option value="performance">Performance</option>
          </select>
        </div>
      </div>

      <div className="page-content">
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading report data...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">👥</div>
                <div className="metric-content">
                  <h3>Total Employees</h3>
                  <p className="metric-value">{reportData.overview.totalEmployees}</p>
                  <span className="metric-change positive">+12 this year</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💰</div>
                <div className="metric-content">
                  <h3>Total Payroll</h3>
                  <p className="metric-value">${reportData.overview.totalPayroll.toLocaleString()}</p>
                  <span className="metric-change positive">+8.5% vs last year</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <h3>Average Salary</h3>
                  <p className="metric-value">${reportData.overview.averageSalary.toLocaleString()}</p>
                  <span className="metric-change positive">+5.2% vs last year</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🏢</div>
                <div className="metric-content">
                  <h3>Departments</h3>
                  <p className="metric-value">{reportData.overview.totalDepartments}</p>
                  <span className="metric-change neutral">No change</span>
                </div>
              </div>
            </div>

            {/* Report Content */}
            {reportType === 'overview' && (
              <div className="report-section">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Company Overview</h2>
                    <button 
                      onClick={() => handleExportReport('overview')}
                      className="btn btn-secondary"
                    >
                      📄 Export Report
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="overview-grid">
                      <div className="overview-item">
                        <h4>New Hires</h4>
                        <p className="overview-value">{reportData.overview.newHires}</p>
                      </div>
                      <div className="overview-item">
                        <h4>Departures</h4>
                        <p className="overview-value">{reportData.overview.departures}</p>
                      </div>
                      <div className="overview-item">
                        <h4>Retention Rate</h4>
                        <p className="overview-value">98%</p>
                      </div>
                      <div className="overview-item">
                        <h4>Growth Rate</h4>
                        <p className="overview-value">+6.2%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'payroll' && (
              <div className="report-section">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Payroll Analysis</h2>
                    <button 
                      onClick={() => handleExportReport('payroll')}
                      className="btn btn-secondary"
                    >
                      📄 Export Report
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="payroll-stats">
                      <div className="stat-item">
                        <span className="stat-label">Processed</span>
                        <span className="stat-value">{reportData.payroll.totalProcessed}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Pending</span>
                        <span className="stat-value">{reportData.payroll.pending}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Total Amount</span>
                        <span className="stat-value">${reportData.payroll.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Average Pay</span>
                        <span className="stat-value">${reportData.payroll.averagePay.toLocaleString()}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Overtime</span>
                        <span className="stat-value">${reportData.payroll.overtime.toLocaleString()}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Bonuses</span>
                        <span className="stat-value">${reportData.payroll.bonuses.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'departments' && (
              <div className="report-section">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Department Analysis</h2>
                    <button 
                      onClick={() => handleExportReport('departments')}
                      className="btn btn-secondary"
                    >
                      📄 Export Report
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="department-analysis">
                      {reportData.departments.map((dept, index) => (
                        <div key={index} className="department-row">
                          <div className="dept-info">
                            <h4>{dept.name}</h4>
                            <p>{dept.employees} employees</p>
                          </div>
                          <div className="dept-stats">
                            <div className="stat">
                              <span className="stat-label">Budget</span>
                              <span className="stat-value">${dept.budget.toLocaleString()}</span>
                            </div>
                            <div className="stat">
                              <span className="stat-label">Utilization</span>
                              <span className="stat-value">{dept.utilization}%</span>
                            </div>
                          </div>
                          <div className="dept-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{width: `${dept.utilization}%`}}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'performance' && (
              <div className="report-section">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Performance Analytics</h2>
                    <button 
                      onClick={() => handleExportReport('performance')}
                      className="btn btn-secondary"
                    >
                      📄 Export Report
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="performance-metrics">
                      <div className="metric-item">
                        <h4>Average Performance Score</h4>
                        <p className="metric-score">4.2/5.0</p>
                      </div>
                      <div className="metric-item">
                        <h4>Top Performers</h4>
                        <p className="metric-score">23 employees</p>
                      </div>
                      <div className="metric-item">
                        <h4>Improvement Needed</h4>
                        <p className="metric-score">8 employees</p>
                      </div>
                      <div className="metric-item">
                        <h4>Review Completion</h4>
                        <p className="metric-score">94%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;



