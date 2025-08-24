import React, { useEffect, useState } from 'react';
import { fetchUserPerformance, fetchSkillGap, fetchTimeBased } from '../services/reportService';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { DummyCharts } from './DummyCharts.jsx';

// Register Chart.js components (required for react-chartjs-2)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

function Reports() {
  const [userPerf, setUserPerf] = useState([]);
  const [skillGap, setSkillGap] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const up = await fetchUserPerformance();
      const sg = await fetchSkillGap();
      const td = await fetchTimeBased(period);
      setUserPerf(up.attempts || []);
      setSkillGap(sg.skills || []);
      setTimeData(td.periods || []);
      setLoading(false);
    };
    load();
  }, [period]);

  return (
    <div>
      <h4>User-wise Performance</h4>
      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', marginBottom: '2rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>User</th><th>Email</th><th>Skill</th><th>Score</th><th>Started</th><th>Ended</th>
            </tr>
          </thead>
          <tbody>
            {userPerf.map((a, i) => (
              <tr key={i}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.skill}</td>
                <td>{a.score}</td>
                <td>{a.started_at?.slice(0,16).replace('T',' ')}</td>
                <td>{a.ended_at?.slice(0,16).replace('T',' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h4>Skill Gap Analysis</h4>
      {/* If chart rendering fails, use <DummyCharts /> below to verify setup. */}
      {skillGap.length > 0 ? (
        <Bar
          data={{
            labels: skillGap.map(s => s.skill),
            datasets: [{
              label: 'Avg Score',
              data: skillGap.map(s => s.avg_score),
              backgroundColor: '#61dafb',
            }]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      ) : <DummyCharts />}
      <h4 style={{ marginTop: '2rem' }}>Time-based Reports</h4>
      <div style={{ marginBottom: '1rem' }}>
        <label>Period: </label>
        <select value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      {timeData.length > 0 && (
        <Line
          data={{
            labels: timeData.map(t => t.period),
            datasets: [{
              label: 'Avg Score',
              data: timeData.map(t => t.avg_score),
              borderColor: '#222',
              backgroundColor: '#61dafb',
              tension: 0.3,
            }]
          }}
          options={{ responsive: true }}
        />
      )}
    </div>
  );
}

export default Reports;
