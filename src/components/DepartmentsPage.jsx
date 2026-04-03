import React, { useState, useEffect } from 'react';
import { departmentsAPI } from '../services/api';
import { 
  Building2, 
  Users, 
  Trash2, 
  Plus, 
  User, 
  DollarSign, 
  X, 
  Loader2, 
  AlertCircle,
  Briefcase,
  PieChart,
  LayoutGrid
} from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      const result = await departmentsAPI.create(newDepartment);
      if (result.success) {
        await loadDepartments();
        setShowAddForm(false);
        setNewDepartment({ name: '', manager: '', budget: '' });
        setError(null);
      } else {
        setError(result.message || 'Failed to add department');
      }
    } catch (err) {
      setError('Failed to add department');
      console.error('Error adding department:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department? All associated employee records may be updated.')) {
      try {
        const result = await departmentsAPI.delete(id);
        if (result.success) {
          loadDepartments();
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

  if (loading && departments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-400" />
            Departments
          </h1>
          <p className="text-slate-400 mt-1">Organize your workforce and manage budgets</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Department
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-900/30 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button onClick={loadDepartments} className="text-xs font-bold uppercase tracking-wider hover:underline">Retry</button>
        </div>
      )}

      {/* Stats Overview for Departments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Units</p>
              <h4 className="text-xl font-bold text-slate-100">{departments.length}</h4>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Growth</p>
              <h4 className="text-xl font-bold text-slate-100">+{Math.ceil(departments.length * 0.1)} unit</h4>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Budget Allocation</p>
              <h4 className="text-xl font-bold text-slate-100">${departments.reduce((s, d) => s + (parseFloat(d.budget) || 0), 0).toLocaleString()}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-8 animate-scale-in relative">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-100 text-center mb-8">New Department</h2>
            
            <form onSubmit={handleAddDepartment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Department Name</label>
                <input
                  type="text"
                  name="name"
                  value={newDepartment.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="e.g. Strategic Engineering"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Operations Manager</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="manager"
                    value={newDepartment.manager}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Enter manager's full name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Quarterly Budget (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    name="budget"
                    value={newDepartment.budget}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/40 transition-all group relative overflow-hidden">
            {/* Design Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
            
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <button 
                onClick={() => handleDeleteDepartment(dept.id)}
                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Delete Unit"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{dept.name}</h3>
            <div className="flex items-center gap-2 mt-1 mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Operations</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-400">Manager</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">{dept.manager}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-400">Headcount</span>
                </div>
                <span className="text-sm font-semibold text-slate-200">{dept.employee_count || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-400">Total Budget</span>
                </div>
                <span className="text-sm font-bold text-indigo-400">${(parseFloat(dept.budget) || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].slice(0, dept.employee_count || 0).map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                {(dept.employee_count > 3) && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                    +{dept.employee_count - 3}
                  </div>
                )}
              </div>
              <button className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">
                View All Personnel
              </button>
            </div>
          </div>
        ))}
        
        {/* Placeholder for adding new */}
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-500/30 hover:bg-slate-900/40 transition-all group min-h-[300px]"
        >
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 group-hover:scale-110 group-hover:text-indigo-400 transition-all border border-slate-700/50">
            <Plus className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-slate-500 group-hover:text-slate-300">Add New Department</p>
        </button>
      </div>
      
      {departments.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-600 mb-4 border border-slate-700/50">
            <Building2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100">No departments configured</h3>
          <p className="text-slate-400 mt-1 max-w-sm">Every high-performance workforce needs structure. Start by creating your first organizational unit.</p>
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage;
