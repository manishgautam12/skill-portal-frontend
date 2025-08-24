import api from './api';

export async function fetchSkills(page = 1, limit = 10) {
  const { data } = await api.get(`/api/admin/skills?page=${page}&limit=${limit}`);
  return data;
}

export async function addSkill(name) {
  const { data } = await api.post('/api/admin/skills', { name });
  return data;
}

export async function updateSkill(id, name) {
  const { data } = await api.put(`/api/admin/skills/${id}`, { name });
  return data;
}

export async function deleteSkill(id) {
  const { data } = await api.delete(`/api/admin/skills/${id}`);
  return data;
}
