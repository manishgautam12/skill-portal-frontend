import api from './api';

export async function fetchUserSkills() {
  const { data } = await api.get('/api/user/dashboard/skills');
  return data;
}

export async function fetchUserHistory() {
  const { data } = await api.get('/api/user/dashboard/history');
  return data;
}
