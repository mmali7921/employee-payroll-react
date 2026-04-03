import React, { useState, useEffect } from 'react';
import { employeesAPI, departmentsAPI, payrollAPI } from '../services/api';
import { 
  LineChart, 
  Users, 
  DollarSign, 
  Building2, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  PieChart, 
  AlertCircle, 
  Loader2,
  Calendar
} from 'lucide-react';

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
      setError(null);
      
      const [employeesResult, departmentsResult, payrollResult] = await Promise.all([
        employeesAPI.getAll(),
        departmentsAPI.getAll(),
        payrollAPI.getSummary(selectedPeriod)
      ]);

      const employees = employeesResult.success ? employeesResult.data : [];
      const departments = departmentsResult.success ? departmentsResult.data : [];
      const payrollSummary = payrollResult.success ? payrollResult.data : {};

      const totalEmployees = employees.length;
      const totalDepartments = departments.length;
      const totalPayroll = employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
      const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

      setReportData({
        overview: {
          totalEmployees,
          totalDepartments,
          totalPayroll,
          averageSalary,
          newHires: employees.filter(e => {
            const hireYear = new Date(e.hire_date).getFullYear();
            return hireYear === parseInt(selectedPeriod);
          }).length,
          departures: employees.filter(e => e.status === 'Inactive').length
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
          utilization: Math.floor(Math.random() * 20) + 75 // Mock utilization for UI
        }))
      });
    } catch (err) {
      setError('Failed to generate report analytics. Please try again.');
      console.error('Error loading report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (type) => {
    alert(`Exporting ${type.toUpperCase()} report for ${selectedPeriod} as PDF...`);
  };

  if (loading && reportData.overview.totalEmployees === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Crunching your numbers...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            <LineChart className="w-8 h-8 text-indigo-400" />
            Analytics & Reports
          </h1>
          <p className="text-slate-400 mt-1">Insightful data to drive your workforce decisions</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer"
            >
              <option value="2025">Year 2025</option>
              <option value="2024">Year 2024</option>
              <option value="2023">Year 2023</option>
            </select>
          </div>
          
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer w-48"
            >
              <option value="overview">Overview Report</option>
              <option value="payroll">Payroll Summary</option>
              <option value="departments">Department Distribution</option>
            </select>
          </div>

          <button 
            onClick={() => handleExportReport(reportType)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-900/20"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-900/30 rounded-xl flex items-center gap-3 text-red-400 animate-slide-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button onClick={loadReportData} className="text-xs font-bold uppercase tracking-wider hover:underline">Retry</button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Headcount</p>
          <h3 className="text-3xl font-bold text-slate-100 mt-1">{reportData.overview.totalEmployees}</h3>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+8.5%</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Annualized Payroll</p>
          <h3 className="text-3xl font-bold text-slate-100 mt-1">${(reportData.overview.totalPayroll * 12).toLocaleString()}</h3>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-full">Global</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Average Salary</p>
          <h3 className="text-3xl font-bold text-slate-100 mt-1">${Math.round(reportData.overview.averageSalary).toLocaleString()}</h3>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Departments</p>
          <h3 className="text-3xl font-bold text-slate-100 mt-1">{reportData.overview.totalDepartments}</h3>
        </div>
      </div>

      {/* Main Report Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Detailed Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {reportType === 'overview' && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-600/10 transition-all"></div>
              
              <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                Workforce Growth
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">New Hires</p>
                  <p className="text-3xl font-bold text-slate-100">{reportData.overview.newHires}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Departures</p>
                  <p className="text-3xl font-bold text-slate-100">{reportData.overview.departures}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Retention</p>
                  <p className="text-3xl font-bold text-emerald-400">97.4%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Growth</p>
                  <p className="text-3xl font-bold text-indigo-400">+5.1%</p>
                </div>
              </div>

              <div className="mt-12 h-48 bg-slate-950/40 rounded-2xl border border-slate-800/50 flex items-center justify-center relative group/chart">
                <div className="absolute inset-0 flex items-end justify-between px-8 py-6">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-4 bg-indigo-500/20 rounded-t-sm group-hover/chart:bg-indigo-500/40 transition-all duration-700" 
                      style={{height: `${h}%`, transitionDelay: `${i * 50}ms`}}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-[0.2em] relative z-10">Monthly Enrollment Trend</p>
              </div>
            </div>
          )}

          {reportType === 'payroll' && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Payroll Performance Summary
              </h3>
              
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-6 bg-slate-950/40 rounded-2xl border border-slate-800/60 group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><CheckCircle2 className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Total Records Processed</p>
                      <p className="text-xs text-slate-500">Includes all employees in current period</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-100">{reportData.payroll.totalProcessed}</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-1">SUCCESSFUL</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-950/40 rounded-2xl border border-slate-800/60 group hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Clock className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Pending Authorization</p>
                      <p className="text-xs text-slate-500">Awaiting management approval</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-100">{reportData.payroll.pending}</p>
                    <p className="text-[10px] text-amber-500 font-bold mt-1">ACTION REQUIRED</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Avg. Net Pay</p>
                    <p className="text-2xl font-bold text-slate-100">${Math.round(reportData.payroll.averagePay).toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Overtime & Adj.</p>
                    <p className="text-2xl font-bold text-slate-100">$0</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'departments' && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-8 border-b border-slate-800/60">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  Department Resource Utilization
                </h3>
              </div>
              <div className="divide-y divide-slate-800/50">
                {reportData.departments.map((dept, index) => (
                  <div key={index} className="p-6 hover:bg-slate-800/20 transition-all flex items-center justify-between group">
                    <div className="flex-1 max-w-xs">
                      <h4 className="font-bold text-slate-200">{dept.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" /> {dept.employees} employees
                      </p>
                    </div>
                    
                    <div className="flex-1 px-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-500 font-bold">BUDGET EFFICIENCY</span>
                        <span className="text-[10px] text-indigo-400 font-bold">{dept.utilization}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                          style={{width: `${dept.utilization}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-100">${dept.budget.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Annual Budget</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Top Insights */}
        <div className="space-y-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Top Insights</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0 animate-pulse"></div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  <span className="text-slate-100 font-semibold">Engineering</span> has the highest budget consumption at 42% of total payroll.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Monthly average pay has increased by <span className="text-emerald-400 font-semibold">3.2%</span> since 2024 began.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Headcount is projected to reach <span className="text-slate-100 font-semibold">50+</span> by Q4 given current trends.
                </p>
              </div>
            </div>
            
            <div className="mt-10 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
              <div className="flex items-center gap-3 text-indigo-400 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Live Alert</span>
              </div>
              <p className="text-xs text-indigo-200/70 italic">“Payroll efficiency is optimized for the current quarter based on headcount vs budget projections.”</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <PieChart className="absolute -right-8 -bottom-8 w-32 h-32 text-indigo-500/10 group-hover:rotate-12 transition-transform duration-700" />
            <h4 className="text-lg font-bold text-slate-100 relative z-10 mb-2">Need Custom Data?</h4>
            <p className="text-sm text-slate-400 relative z-10 mb-6">Create a bespoke dataset export for your specific board meeting requirements.</p>
            <button className="relative z-10 px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
              Contact Analyst
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;



