
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isUser } from '../services/authService';

export function ProtectedRoute({ children, role }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let check;
    if (role === 'admin') check = isAdmin;
    else if (role === 'user') check = isUser;
    else check = isAuthenticated;
    check().then(setAllowed);
  }, [role]);

  if (allowed === null) return <div>Loading...</div>;
  if (!allowed) return <Navigate to="/login" replace />;
  return children;
}
