import React, { useEffect, useState } from 'react';
import { fetchUserSkills, fetchUserHistory } from '../services/userDashboardService';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [skills, setSkills] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const s = await fetchUserSkills();
        const h = await fetchUserHistory();
        setSkills(s.skills || []);
        setHistory(h.attempts || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Optionally redirect to login on auth failure
        // navigate('/login');
      }
      setLoading(false);
    };
    load();
  }, []); // Empty dependency array - only run on mount

  return (
    <div className="container">
      <div className="card">
        <h2>User Dashboard</h2>
        <h4>Available Skills</h4>
        {loading ? <p>Loading...</p> : (
          <ul style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {skills.map(skill => (
              <li key={skill.id} style={{ listStyle: 'none' }}>
                <button onClick={() => navigate(`/user/quiz?skill_id=${skill.id}`)}>{skill.name}</button>
              </li>
            ))}
          </ul>
        )}
        <h4 style={{ marginTop: '2rem' }}>Quiz History</h4>
        {loading ? <p>Loading...</p> : (
          <table>
            <thead>
              <tr>
                <th>Skill</th><th>Score</th><th>Started</th><th>Ended</th>
              </tr>
            </thead>
            <tbody>
              {history.map((a, i) => (
                <tr key={i}>
                  <td>{a.skill}</td>
                  <td>{a.score}</td>
                  <td>{a.started_at?.slice(0,16).replace('T',' ')}</td>
                  <td>{a.ended_at?.slice(0,16).replace('T',' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
