import api from './api';

export async function fetchQuestions(page = 1, limit = 10, skill_id = null) {
  let url = `/api/admin/questions?page=${page}&limit=${limit}`;
  if (skill_id) url += `&skill_id=${skill_id}`;
  const { data } = await api.get(url);
  return data;
}

export async function addQuestion(question) {
  const { data } = await api.post('/api/admin/questions', question);
  return data;
}

export async function updateQuestion(id, question) {
  const { data } = await api.put(`/api/admin/questions/${id}`, question);
  return data;
}

export async function deleteQuestion(id) {
  const { data } = await api.delete(`/api/admin/questions/${id}`);
  return data;
}
