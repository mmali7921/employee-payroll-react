import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';

// Import contexts
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// Import page components
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import EmployeesPage from './components/EmployeesPage';
import DepartmentsPage from './components/DepartmentsPage';
import PayrollPage from './components/PayrollPage';
import ReportsPage from './components/ReportsPage';
import AddEmployeePage from './components/AddEmployeePage';
import EmployeeViewPage from './components/EmployeeViewPage';
import EmployeeEditPage from './components/EmployeeEditPage';
import Navigation from './components/Navigation';
import MainLayout from './components/MainLayout';
import { Loader2 } from 'lucide-react';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }
  
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app bg-slate-950 min-h-screen">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            } />
            <Route path="/employees/add" element={
              <ProtectedRoute>
                <AddEmployeePage />
              </ProtectedRoute>
            } />
            <Route path="/employees/:id" element={
              <ProtectedRoute>
                <EmployeeViewPage />
              </ProtectedRoute>
            } />
            <Route path="/employees/:id/edit" element={
              <ProtectedRoute>
                <EmployeeEditPage />
              </ProtectedRoute>
            } />
            <Route path="/departments" element={
              <ProtectedRoute>
                <DepartmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/payroll" element={
              <ProtectedRoute>
                <PayrollPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;