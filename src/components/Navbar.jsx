
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useLogout } from '../hooks/useLogout';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const handleLogout = useLogout();
  const { auth, user } = useAuth();
  
  const confirmAndLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      handleLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Skill Portal</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        
        {/* Show Login and Register only when not authenticated */}
        {!auth && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
        
        {/* Show dashboard link based on user role when authenticated */}
        {auth && user?.role === 'user' && (
          <li><Link to="/user/dashboard">User Dashboard</Link></li>
        )}
        
        {auth && user?.role === 'admin' && (
          <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
        )}
        
        {/* Show Logout only when authenticated */}
        {auth && (
          <li>
            <button 
              onClick={confirmAndLogout} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#fff', 
                cursor: 'pointer', 
                fontSize: '1rem',
                textDecoration: 'underline'
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
