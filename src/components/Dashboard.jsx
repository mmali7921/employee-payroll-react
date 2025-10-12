import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeesAPI, departmentsAPI } from '../services/api';

// Dashboard Stats Component
function DashboardStats() {
  const [stats, setStats] = useState([
    { title: 'Total Employees', value: '0', change: '0%', color: 'blue' },
    { title: 'Active Departments', value: '0', change: '0', color: 'green' },
    { title: 'Monthly Payroll', value: '$0', change: '0%', color: 'purple' },
    { title: 'Pending Approvals', value: '0', change: '0', color: 'orange' }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load employees
      const employeesResult = await employeesAPI.getAll();
      const employees = employeesResult.success ? employeesResult.data : [];
      
      // Load departments
      const departmentsResult = await departmentsAPI.getAll();
      const departments = departmentsResult.success ? departmentsResult.data : [];

      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
      const totalDepartments = departments.length;
      const totalPayroll = employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);

      setStats([
        { title: 'Total Employees', value: totalEmployees.toString(), change: `+${activeEmployees} active`, color: 'blue' },
        { title: 'Active Departments', value: totalDepartments.toString(), change: 'departments', color: 'green' },
        { title: 'Monthly Payroll', value: `$${totalPayroll.toLocaleString()}`, change: 'total', color: 'purple' },
        { title: 'Pending Approvals', value: '0', change: 'none', color: 'orange' }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-content">
            <h3 className="stat-title">{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
            <p className={`stat-change stat-change-${stat.color}`}>{stat.change}</p>
          </div>
          <div className={`stat-icon stat-icon-${stat.color}`}>
            {stat.title.includes('Employees') && '👥'}
            {stat.title.includes('Departments') && '🏢'}
            {stat.title.includes('Payroll') && '💰'}
            {stat.title.includes('Approvals') && '⏳'}
          </div>
        </div>
      ))}
    </div>
  );
}

// Recent Activity Component
function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setLoading(true);
      const [employeesResult, departmentsResult] = await Promise.all([
        employeesAPI.getAll(),
        departmentsAPI.getAll()
      ]);

      const activities = [];

      // Add recent employees
      if (employeesResult.success && employeesResult.data) {
        const recentEmployees = employeesResult.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        
        recentEmployees.forEach(emp => {
          activities.push({
            action: `New employee added: ${emp.emp_name}`,
            user: emp.department,
            time: formatTimeAgo(emp.created_at),
            type: 'add'
          });
        });
      }

      // Add recent departments
      if (departmentsResult.success && departmentsResult.data) {
        const recentDepartments = departmentsResult.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 2);
        
        recentDepartments.forEach(dept => {
          activities.push({
            action: `Department created: ${dept.name}`,
            user: dept.manager,
            time: formatTimeAgo(dept.created_at),
            type: 'update'
          });
        });
      }

      // Sort by time and take the most recent 4
      setActivities(activities
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 4)
      );
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <div className="card-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading activity...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Recent Activity</h2>
      </div>
      <div className="card-content">
        <div className="activity-list">
          {activities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No recent activity</h3>
              <p>Start by adding employees or departments</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon activity-icon-${activity.type}`}>
                  {activity.type === 'add' && '➕'}
                  {activity.type === 'payroll' && '💰'}
                  {activity.type === 'update' && '✏️'}
                  {activity.type === 'promotion' && '⬆️'}
                </div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-meta">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Quick Actions</h2>
      </div>
      <div className="card-content">
        <div className="quick-actions-grid">
          <Link to="/employees/add" className="quick-action-btn">
            <div className="quick-action-icon">👤</div>
            <span>Add Employee</span>
          </Link>
          <Link to="/payroll/process" className="quick-action-btn">
            <div className="quick-action-icon">💰</div>
            <span>Process Payroll</span>
          </Link>
          <Link to="/departments" className="quick-action-btn">
            <div className="quick-action-icon">🏢</div>
            <span>Manage Departments</span>
          </Link>
          <Link to="/reports" className="quick-action-btn">
            <div className="quick-action-icon">📊</div>
            <span>Generate Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
function Dashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Employee Payroll Dashboard</h1>
          <p className="page-subtitle">Manage your workforce and payroll efficiently</p>
        </div>
      </div>

      <div className="page-content">
        {/* Welcome Message */}
        <div className="info-message">
          <span className="info-icon">ℹ️</span>
          <div className="info-content">
            <p>Welcome to PayrollPro! Your employee management system is ready to use. Start by adding employees or managing departments.</p>
          </div>
        </div>

        <DashboardStats />
        
        <div className="grid gap-6 mt-8">
          <div className="lg:grid-cols-2 grid gap-6">
            <RecentActivity />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
