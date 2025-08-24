import './auth.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = role === 'admin'
        ? '/api/admin/auth/login'
        : '/api/user/auth/login';
      const { data } = await axios.post(url, { email, password }, { withCredentials: true });
      // The backend sets the cookie; update auth context immediately with user data
      const userData = { email, role, ...data.user };
      setAuthenticatedUser(userData);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label>Role</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
