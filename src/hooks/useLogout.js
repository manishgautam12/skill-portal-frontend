import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function useLogout() {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  return async function handleLogout() {
    try {
      await api.post('/api/user/auth/logout');
    } catch {}
    clearAuth();
    navigate('/login');
  };
}
