import api from './api';

export async function fetchQuizQuestions(skill_id) {
  const { data } = await api.get(`/api/user/quiz/questions?skill_id=${skill_id}`);
  return data;
}

export async function submitQuizAttempt(skill_id, answers) {
  const { data } = await api.post('/api/user/quiz/submit', { skill_id, answers });
  return data;
}
