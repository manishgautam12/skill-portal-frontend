
import QuizPage from './pages/QuizPage.jsx';
import Navbar from './components/Navbar.jsx';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/dashboard" element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user/quiz" element={
            <ProtectedRoute role="user">
              <QuizPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
