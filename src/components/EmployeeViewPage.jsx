import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeesAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Calendar, 
  HeartPulse, 
  ShieldCheck, 
  ChevronLeft, 
  Edit3, 
  Loader2, 
  AlertCircle,
  BadgeCheck,
  Clock
} from 'lucide-react';

function EmployeeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const result = await employeesAPI.getById(id);
      if (result.success) {
        setEmployee(result.data);
        setError(null);
      } else {
        setError(result.message || 'Failed to load employee record');
      }
    } catch (err) {
      setError('Connection failure while retrieving employee data');
      console.error('Error loading employee:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Retrieving personnel record...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">{error || 'Personnel Not Found'}</h2>
        <p className="text-slate-400 mb-8">The requested employee record could not be located in our secure database.</p>
        <button 
          onClick={() => navigate('/employees')} 
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-200 lg:pb-24">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Personnel Registry
        </button>
        
        <Link 
          to={`/employees/${id}/edit`} 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2rem] p-8 md:p-12 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-600/10 transition-all duration-1000"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-5xl font-bold text-indigo-400 shadow-2xl">
            {employee.emp_name.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left pt-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">{employee.emp_name}</h1>
              <BadgeCheck className="w-8 h-8 text-indigo-400 hidden md:block" />
            </div>
            <p className="text-xl text-slate-400 font-medium mb-6">{employee.position}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                employee.status === 'Active' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {employee.status === 'Active' ? <ShieldCheck className="w-3.5 h-3.5 mr-2" /> : <Clock className="w-3.5 h-3.5 mr-2" />}
                {employee.status}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-full text-xs font-bold uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5 mr-2" />
                {employee.department}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Employment & Core Data */}
        <div className="space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              Organizational Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                <span className="text-sm text-slate-500 font-medium">Employee ID</span>
                <span className="text-sm font-bold text-slate-200">#EP-{employee.emp_id}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                <span className="text-sm text-slate-500 font-medium">Annual Compensation</span>
                <span className="text-sm font-bold text-indigo-400">${parseFloat(employee.salary).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                <span className="text-sm text-slate-500 font-medium">Activation Date</span>
                <span className="text-sm font-bold text-slate-200">{new Date(employee.hire_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500 font-medium">Tenure</span>
                <span className="text-sm font-bold text-emerald-400">
                  {Math.floor((new Date() - new Date(employee.hire_date)) / (1000 * 60 * 60 * 24 * 365))} Years
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              Communication
            </h3>
            
            <div className="space-y-6">
              <div className="group">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Corporate Email</p>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 transition-colors cursor-pointer underline decoration-indigo-500/30">{employee.emp_mail_id}</span>
                </div>
              </div>
              <div className="group">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Phone Extension</p>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-200">{employee.phone || 'N/A'}</span>
                </div>
              </div>
              <div className="group">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Physical Address</p>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-200">{employee.address || 'Standard Corporate Housing'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Security */}
        <div className="space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-400" />
              Safety & Support
            </h3>
            
            <div className="p-6 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Emergency Contact</p>
              <h4 className="text-lg font-bold text-slate-100 mb-1">{employee.emergency_contact || 'None Listed'}</h4>
              <p className="text-sm text-slate-400 mb-4 font-medium italic">Authorized emergency liaison</p>
              <div className="flex items-center gap-3 py-2 px-4 bg-slate-900/80 rounded-xl border border-slate-700/30 w-fit">
                <Phone className="w-4 h-4 text-red-400" />
                <span className="text-sm font-bold text-slate-200">{employee.emergency_phone || 'Unverified'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 space-y-6">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 leading-tight">Data Integrity Verified</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              This personnel record is synchronized with the regional payroll grid and meets all corporate security compliance standards for {new Date().getFullYear()}.
            </p>
            <div className="pt-4 flex gap-4">
              <button className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">Generate Dossier</button>
              <button className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">Access Logs</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EmployeeViewPage;



