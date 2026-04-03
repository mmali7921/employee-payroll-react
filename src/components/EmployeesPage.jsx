import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeesAPI } from '../services/api';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  UserCheck,
  Building
} from 'lucide-react';

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
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        const result = await employeesAPI.delete(id);
        if (result.success) {
          loadEmployees();
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

  if (loading && employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">Loading employee directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Employee Directory</h1>
          <p className="text-slate-400 mt-1">Manage and monitor your global workforce</p>
        </div>
        <Link 
          to="/employees/add" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Employee
        </Link>
      </div>

      {/* Mini Stats for this page */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Staff</p>
            <p className="text-2xl font-bold text-slate-100">{employees.length}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Status</p>
            <p className="text-2xl font-bold text-slate-100">{employees.filter(e => e.status === 'Active').length}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Departments</p>
            <p className="text-2xl font-bold text-slate-100">{departments.length}</p>
          </div>
        </div>
      </div>

      {/* Filters Overlay */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-4 mb-6 sticky top-20 z-30 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-900/30 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button onClick={loadEmployees} className="text-xs font-bold uppercase tracking-wider hover:underline">Retry</button>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Position & Salary</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredEmployees.map((employee) => (
                <tr key={employee.emp_id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold group-hover:scale-110 transition-transform">
                        {employee.emp_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-100">{employee.emp_name}</div>
                        <div className="text-xs text-slate-500">{employee.emp_mail_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">{employee.position}</div>
                    <div className="text-xs text-indigo-400 font-medium tracking-tight mt-0.5">${parseFloat(employee.salary).toLocaleString()} / yr</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      employee.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : employee.status === 'On Leave'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      <span className={`w-1 h-1 rounded-full mr-1.5 ${
                        employee.status === 'Active' ? 'bg-emerald-400' : employee.status === 'On Leave' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/employees/${employee.emp_id}`}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        to={`/employees/${employee.emp_id}/edit`}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteEmployee(employee.emp_id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredEmployees.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-600 mb-4 border border-slate-700/50">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">No employees found</h3>
              <p className="text-slate-400 mt-1 max-w-sm">We couldn't find any employees matching your current search or filter criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedDepartment('all');}}
                className="mt-6 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;
