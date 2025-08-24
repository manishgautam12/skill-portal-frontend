import api from './api';

export async function fetchUserPerformance(user_id = null) {
  let url = '/api/admin/reports/user-performance';
  if (user_id) url += `?user_id=${user_id}`;
  const { data } = await api.get(url);
  return data;
}

export async function fetchSkillGap() {
  const { data } = await api.get('/api/admin/reports/skill-gap');
  return data;
}

export async function fetchTimeBased(period = 'week') {
  const { data } = await api.get(`/api/admin/reports/time-based?period=${period}`);
  return data;
}
