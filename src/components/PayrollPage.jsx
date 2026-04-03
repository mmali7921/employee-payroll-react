import React, { useState, useEffect } from 'react';
import { payrollAPI } from '../services/api';
import { 
  Banknote, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  DollarSign,
  TrendingDown,
  RefreshCcw,
  ShieldCheck,
  FileText
} from 'lucide-react';

function PayrollPage() {
  const [payrollData, setPayrollData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setLoading(true);
      const result = await payrollAPI.generate(selectedPeriod);
      if (result.success) {
        await loadPayrollData();
        setError(null);
      } else {
        if (result.message && result.message.includes('already exists')) {
          await loadPayrollData();
          setError(null);
        } else {
          setError(result.message || 'Failed to generate payroll');
        }
      }
    } catch (err) {
      setError('Failed to generate payroll');
      console.error('Error generating payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async () => {
    try {
      setIsProcessing(true);
      const result = await payrollAPI.process(selectedPeriod);
      if (result.success) {
        await loadPayrollData();
        setShowProcessForm(false);
        setError(null);
      } else {
        setError(result.message || 'Failed to process payroll');
      }
    } catch (err) {
      setError('Failed to process payroll');
      console.error('Error processing payroll:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPayroll = payrollData.reduce((sum, emp) => sum + (parseFloat(emp.net_pay) || 0), 0);
  const totalDeductions = payrollData.reduce((sum, emp) => sum + (parseFloat(emp.total_deductions) || 0), 0);
  const processedCount = payrollData.filter(emp => emp.status === 'Processed').length;
  const pendingCount = payrollData.filter(emp => emp.status === 'Pending').length;

  const periods = [
    '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
    '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
    '2025-01', '2025-02', '2025-03'
  ];

  const formatPeriod = (period) => {
    const [year, month] = period.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-200">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            <Banknote className="w-8 h-8 text-indigo-400" />
            Payroll Management
          </h1>
          <p className="text-slate-400 mt-1">Manage, calculate, and process employee compensation</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer"
            >
              {periods.map(p => (
                <option key={p} value={p}>{formatPeriod(p)}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={handleGeneratePayroll}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Generate
          </button>
          
          <button 
            onClick={() => setShowProcessForm(true)}
            disabled={payrollData.length === 0 || pendingCount === 0}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-900/20 transition-all disabled:opacity-50"
          >
            Process Batch
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Total Net Pay</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">${totalPayroll.toLocaleString()}</h3>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-100">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Total Deductions</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">${totalDeductions.toLocaleString()}</h3>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Processed</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">{processedCount} <span className="text-xs font-normal text-slate-500">records</span></h3>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Pending</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">{pendingCount} <span className="text-xs font-normal text-slate-500">records</span></h3>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-900/30 rounded-xl flex items-center gap-3 text-red-400 animate-slide-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button onClick={loadPayrollData} className="text-xs font-bold uppercase tracking-wider hover:underline">Dismiss</button>
        </div>
      )}

      {/* Processing Modal Overlay */}
      {showProcessForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-scale-in">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 text-center mb-2">Finalize Payroll</h2>
            <p className="text-slate-400 text-center mb-8 px-4">
              You are about to process payroll for <span className="text-indigo-400 font-semibold">{formatPeriod(selectedPeriod)}</span>. This will mark all pending records as processed.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleProcessPayroll}
                disabled={isProcessing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Payment processing'}
              </button>
              <button 
                onClick={() => setShowProcessForm(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[400px]">
        {loading && payrollData.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 italic">Calculating payroll for {formatPeriod(selectedPeriod)}...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {payrollData.length > 0 ? payrollData.map((emp) => (
                  <tr key={emp.id || `payroll-${emp.employee_id}-${selectedPeriod}`} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 border border-slate-700 group-hover:scale-110 transition-transform">
                          {emp.emp_name ? emp.emp_name.charAt(0) : 'E'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-100">{emp.emp_name || `ID: ${emp.employee_id}`}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest uppercase">{emp.period}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                      ${(parseFloat(emp.base_salary) || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      ${(parseFloat(emp.gross_pay) || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-400/80">
                      -${(parseFloat(emp.total_deductions) || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-indigo-400 tracking-tight">${(parseFloat(emp.net_pay) || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        emp.status === 'Processed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {emp.status === 'Processed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center text-slate-600 mb-4 border border-slate-700/50">
                          <FileText className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-200">No payroll records</h4>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs">There are no compensation records for this period. Click 'Generate' to initialize.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PayrollPage;
