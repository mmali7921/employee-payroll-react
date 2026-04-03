import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeesAPI, departmentsAPI } from '../services/api';
import { Users, Building2, CircleDollarSign, Hourglass, Plus, Edit2, Info, Loader2, FolderPlus, UserPlus } from 'lucide-react';

function DashboardStats() {
  const [stats, setStats] = useState([
    { title: 'Total Employees', value: '0', change: '0%', color: 'indigo', icon: Users },
    { title: 'Active Departments', value: '0', change: '0', color: 'emerald', icon: Building2 },
    { title: 'Monthly Payroll', value: '$0', change: '0%', color: 'purple', icon: CircleDollarSign },
    { title: 'Pending Approvals', value: '0', change: '0', color: 'amber', icon: Hourglass }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const employeesResult = await employeesAPI.getAll();
      const employees = employeesResult.success ? employeesResult.data : [];
      
      const departmentsResult = await departmentsAPI.getAll();
      const departments = departmentsResult.success ? departmentsResult.data : [];

      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
      const totalDepartments = departments.length;
      const totalPayroll = employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);

      setStats([
        { title: 'Total Employees', value: totalEmployees.toString(), change: `+${activeEmployees} active`, color: 'indigo', icon: Users },
        { title: 'Active Departments', value: totalDepartments.toString(), change: 'departments', color: 'emerald', icon: Building2 },
        { title: 'Monthly Payroll', value: `$${totalPayroll.toLocaleString()}`, change: 'total', color: 'purple', icon: CircleDollarSign },
        { title: 'Pending Approvals', value: '0', change: 'none', color: 'amber', icon: Hourglass }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorStyles = {
          indigo: 'bg-indigo-500/10 text-indigo-400',
          emerald: 'bg-emerald-500/10 text-emerald-400',
          purple: 'bg-purple-500/10 text-purple-400',
          amber: 'bg-amber-500/10 text-amber-400'
        }[stat.color];

        return (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between hover:border-slate-700 hover:shadow-lg transition-all group animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-slate-400 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold tracking-tight text-slate-100 mb-1">{stat.value}</p>
              <p className={`text-xs font-medium ${stat.color === 'emerald' ? 'text-emerald-500' : 'text-slate-500'}`}>{stat.change}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorStyles} group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

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

      if (employeesResult.success && employeesResult.data) {
        const recentEmployees = [...employeesResult.data]
          .sort((a, b) => new Date(b.created_at || new Date()) - new Date(a.created_at || new Date()))
          .slice(0, 3);
        
        recentEmployees.forEach(emp => {
          activities.push({
            action: `New employee added: ${emp.emp_name || emp.first_name + ' ' + emp.last_name}`,
            user: emp.department || 'HR',
            time: 'Recently',
            type: 'add'
          });
        });
      }

      if (departmentsResult.success && departmentsResult.data) {
        const recentDepartments = [...departmentsResult.data]
          .sort((a, b) => new Date(b.created_at || new Date()) - new Date(a.created_at || new Date()))
          .slice(0, 2);
        
        recentDepartments.forEach(dept => {
          activities.push({
            action: `Department updated: ${dept.department_name || dept.name}`,
            user: 'Admin',
            time: 'Recently',
            type: 'update'
          });
        });
      }

      setActivities(activities.slice(0, 4));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full animate-pulse">
        <div className="px-6 py-5 border-b border-slate-800"><div className="h-6 w-32 bg-slate-800 rounded"></div></div>
        <div className="p-6 flex-1 flex items-center justify-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100">Recent Activity</h2>
      </div>
      <div className="p-6 flex-1 flex flex-col gap-6">
        {activities.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-8">
            <Info className="w-8 h-8 mb-3 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'add' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {activity.type === 'add' ? <Plus className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { name: 'Add Employee', path: '/employees/add', icon: UserPlus, color: 'text-indigo-400 bg-indigo-500/10' },
    { name: 'Process Payroll', path: '/payroll', icon: CircleDollarSign, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Manage Departments', path: '/departments', icon: FolderPlus, color: 'text-purple-400 bg-purple-500/10' },
    { name: 'Generate Reports', path: '/reports', icon: Users, color: 'text-blue-400 bg-blue-500/10' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100">Quick Actions</h2>
      </div>
      <div className="p-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} to={action.path} className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group">
                <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Employee Payroll Dashboard</h1>
        <p className="text-slate-400 mt-1">Manage your workforce and payroll efficiently</p>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-4 items-start mb-8 text-indigo-200">
        <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm">Welcome to PayrollPro! Your premium employee management system is ready to use. Start by adding employees or managing departments.</p>
      </div>

      <DashboardStats />
      
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}

export default Dashboard;
