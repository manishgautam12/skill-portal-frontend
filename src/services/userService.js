import api from './api';

export async function fetchUsers(page = 1, limit = 10) {
  const { data } = await api.get(`/api/admin/users?page=${page}&limit=${limit}`);
  return data;
}

export async function addUser(user) {
  const { data } = await api.post('/api/admin/users', user);
  return data;
}

export async function updateUser(id, user) {
  const { data } = await api.put(`/api/admin/users/${id}`, user);
  return data;
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/api/admin/users/${id}`);
  return data;
}
