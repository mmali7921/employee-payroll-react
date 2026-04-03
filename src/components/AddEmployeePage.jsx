import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';

function AddEmployeePage() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
  }, []);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.emp_name.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }
    if (!formData.emp_mail_id.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emp_mail_id.trim())) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const employeeData = {
        emp_name: formData.emp_name.trim(),
        emp_mail_id: formData.emp_mail_id.trim(),
        department: formData.department,
        position: formData.position.trim(),
        salary: parseFloat(formData.salary),
        hire_date: formData.hire_date,
        status: formData.status,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        emergency_contact: formData.emergency_contact.trim(),
        emergency_phone: formData.emergency_phone.trim()
      };

      const result = await employeesAPI.create(employeeData);
      if (result.success) {
        navigate('/employees');
      } else {
        setError(result.message || 'Failed to initialize employee record');
      }
    } catch (err) {
      setError('Failed to add employee');
      console.error('Error adding employee:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-200">
      <button 
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Personnel
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            Onboard New Personnel
          </h1>
          <p className="text-slate-400 mt-1">Initialize record for a new organizational member</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        {error && (
          <div className="p-4 bg-red-950/30 border border-red-900/30 rounded-xl flex items-center gap-3 text-red-400 animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Section: Personal Info */}
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
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="e.g. Jean-Luc Picard"
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
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="j.picard@company.com"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Employment Details */}
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
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name} className="bg-slate-900 border-none">{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Position</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="e.g. Senior Strategist"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Annual Salary (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Activation Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Contact & Emergency */}
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
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Residency</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="City, Province, Space"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Emergency Liaison</label>
              <div className="relative">
                <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="Full name of contact"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Emergency Network</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="tel"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="Contact phone number"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-6 pb-20">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Initialize Employee Account
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/employees')}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-medium transition-all"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployeePage;
