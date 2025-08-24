import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null); // Store user info including role

  // Function to check auth and get user info - memoized to prevent recreations
  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/api/user/auth/session');
      if (res.data.user) {
        setAuth(true);
        setUser(res.data.user);
      } else {
        setAuth(false);
        setUser(null);
      }
    } catch {
      setAuth(false);
      setUser(null);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Function to set authenticated user - memoized
  const setAuthenticatedUser = useCallback((userData) => {
    setAuth(true);
    setUser(userData);
  }, []);

  // Function to clear auth - memoized
  const clearAuth = useCallback(() => {
    setAuth(false);
    setUser(null);
  }, []);

  // Expose auth state and functions
  return (
    <AuthContext.Provider value={{ 
      auth, 
      user, 
      setAuth, 
      setUser,
      refreshAuth: checkAuth,
      setAuthenticatedUser,
      clearAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
