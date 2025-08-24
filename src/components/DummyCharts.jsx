import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

export function DummyCharts() {
  // Dummy data for bar and line charts
  const barData = {
    labels: ['Skill A', 'Skill B', 'Skill C'],
    datasets: [{
      label: 'Avg Score',
      data: [3, 4, 2],
      backgroundColor: '#61dafb',
    }]
  };
  const lineData = {
    labels: ['2025-08-01', '2025-08-08', '2025-08-15'],
    datasets: [{
      label: 'Avg Score',
      data: [2, 3, 4],
      borderColor: '#222',
      backgroundColor: '#61dafb',
      tension: 0.3,
    }]
  };
  return (
    <div>
      <h4>Bar Chart Example</h4>
      <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      <h4 style={{ marginTop: '2rem' }}>Line Chart Example</h4>
      <Line data={lineData} options={{ responsive: true }} />
    </div>
  );
}
