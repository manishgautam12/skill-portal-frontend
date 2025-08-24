import SkillManagement from '../components/SkillManagement.jsx';
import QuestionManagement from '../components/QuestionManagement.jsx';
import UserManagement from '../components/UserManagement.jsx';
import Reports from '../components/Reports.jsx';
import './admin-dashboard.css';
import React, { useState } from 'react';

const sections = [
  { key: 'users', label: 'User Management' },
  { key: 'skills', label: 'Skill Management' },
  { key: 'questions', label: 'Question Management' },
  { key: 'reports', label: 'Reports' },
];

function AdminDashboard() {
  const [active, setActive] = useState('users');

  return (
    <div className="container">
      <div className="admin-dashboard">
        <aside className="admin-sidebar">
          <h2>Admin Panel</h2>
          <ul>
            {sections.map(s => (
              <li key={s.key} className={active === s.key ? 'active' : ''} onClick={() => setActive(s.key)}>
                {s.label}
              </li>
            ))}
          </ul>
        </aside>
        <main className="admin-main">
          <h3>{sections.find(s => s.key === active)?.label}</h3>
          <div className="admin-section-content card">
            {active === 'users' ? (
              <UserManagement />
            ) : active === 'skills' ? (
              <SkillManagement />
            ) : active === 'questions' ? (
              <QuestionManagement />
            ) : active === 'reports' ? (
              <Reports />
            ) : (
              <p>Coming soon: {sections.find(s => s.key === active)?.label}</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
