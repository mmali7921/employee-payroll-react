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

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Navigation />
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute>
                <Navigation />
                <EmployeesPage />
              </ProtectedRoute>
            } />
            <Route path="/employees/add" element={
              <ProtectedRoute>
                <Navigation />
                <AddEmployeePage />
              </ProtectedRoute>
            } />
            <Route path="/employees/:id" element={
              <ProtectedRoute>
                <Navigation />
                <EmployeeViewPage />
              </ProtectedRoute>
            } />
            <Route path="/employees/:id/edit" element={
              <ProtectedRoute>
                <Navigation />
                <EmployeeEditPage />
              </ProtectedRoute>
            } />
            <Route path="/departments" element={
              <ProtectedRoute>
                <Navigation />
                <DepartmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/payroll" element={
              <ProtectedRoute>
                <Navigation />
                <PayrollPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Navigation />
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