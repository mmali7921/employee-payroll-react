import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeesAPI, departmentsAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Calendar, 
  Phone, 
  MapPin, 
  HeartPulse, 
  Loader2, 
  ChevronLeft, 
  Save, 
  AlertCircle,
  ShieldCheck,
  Clock
} from 'lucide-react';

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
        const emp = result.data;
        setFormData({
          emp_name: emp.emp_name || '',
          emp_mail_id: emp.emp_mail_id || '',
          department: emp.department || '',
          position: emp.position || '',
          salary: emp.salary || '',
          hire_date: emp.hire_date ? emp.hire_date.split('T')[0] : '',
          phone: emp.phone || '',
          address: emp.address || '',
          emergency_contact: emp.emergency_contact || '',
          emergency_phone: emp.emergency_phone || '',
          status: emp.status || 'Active'
        });
        setError(null);
      } else {
        setError(result.message || 'Failed to initialize record editor');
      }
    } catch (err) {
      setError('Connection failure while retrieving record');
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

    try {
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
        navigate(`/employees/${id}`);
      } else {
        setError(result.message || 'Failed to commit changes');
      }
    } catch (err) {
      setError('Update operation failed');
      console.error('Error updating employee:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Opening record editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-200">
      <button 
        onClick={() => navigate(`/employees/${id}`)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Profile
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            Modify Personnel Record
          </h1>
          <p className="text-slate-400 mt-1">Updating information for {formData.emp_name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        {error && (
          <div className="p-4 bg-red-950/30 border border-red-900/30 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Section: Identity */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100">Primary Identity</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  name="emp_name"
                  value={formData.emp_name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  name="emp_mail_id"
                  value={formData.emp_mail_id}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Job Logistics */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100">Employment Logistics</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Organizational Unit</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer font-medium"
                required
              >
                <option value="" disabled>Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name} className="bg-slate-900">{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Salary (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Operational Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer font-medium"
              >
                <option value="Active" className="bg-slate-900">Active</option>
                <option value="Inactive" className="bg-slate-900">Inactive</option>
                <option value="On Leave" className="bg-slate-900">On Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Context & Safety */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100">Context & Safety</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Extension</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Residency</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Emergency Liaison</label>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Emergency Network</label>
              <input
                type="tel"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-6 pb-20">
          <button 
            type="submit" 
            disabled={saving}
            className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Commit Record Changes
          </button>
          <button 
            type="button" 
            onClick={() => navigate(`/employees/${id}`)}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-medium transition-all"
          >
            Discard Edits
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeEditPage;
