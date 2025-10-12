import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Navigation() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">💼</div>
            <span className="logo-text">PayrollPro</span>
          </Link>
        </div>

        <div className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link to="/employees" className={`nav-link ${isActive('/employees')}`}>
            <span className="nav-icon">👥</span>
            Employees
          </Link>
          <Link to="/departments" className={`nav-link ${isActive('/departments')}`}>
            <span className="nav-icon">🏢</span>
            Departments
          </Link>
          <Link to="/payroll" className={`nav-link ${isActive('/payroll')}`}>
            <span className="nav-icon">💰</span>
            Payroll
          </Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports')}`}>
            <span className="nav-icon">📈</span>
            Reports
          </Link>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role || 'User'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            🚪
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
