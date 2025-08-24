import React, { useEffect, useState } from 'react';
import { fetchQuestions, addQuestion, updateQuestion, deleteQuestion } from '../services/questionService';
import { fetchSkills } from '../services/skillService';

function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ skill_id: '', question: '', options: ['', '', '', ''], correct_answer: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ skill_id: '', question: '', options: ['', '', '', ''], correct_answer: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterSkill, setFilterSkill] = useState('');

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await fetchQuestions(1, 20, filterSkill || null);
      setQuestions(data.questions);
    } catch (err) {
      setError('Failed to load questions');
    }
    setLoading(false);
  };

  const loadSkills = async () => {
    try {
      const data = await fetchSkills(1, 100);
      setSkills(data.skills);
    } catch {}
  };

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line
  }, [filterSkill]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleOptionChange = (idx, value) => {
    setForm(f => {
      const opts = [...f.options];
      opts[idx] = value;
      return { ...f, options: opts };
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await addQuestion({ ...form, options: form.options, correct_answer: form.correct_answer });
      setSuccess('Question added!');
      setForm({ skill_id: '', question: '', options: ['', '', '', ''], correct_answer: '' });
      loadQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Add failed');
    }
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setEditForm({
      skill_id: q.skill_id,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
      correct_answer: q.correct_answer
    });
  };
  const handleEditOptionChange = (idx, value) => {
    setEditForm(f => {
      const opts = [...f.options];
      opts[idx] = value;
      return { ...f, options: opts };
    });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateQuestion(editId, { ...editForm, options: editForm.options, correct_answer: editForm.correct_answer });
      setSuccess('Question updated!');
      setEditId(null);
      setEditForm({ skill_id: '', question: '', options: ['', '', '', ''], correct_answer: '' });
      loadQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    setError(''); setSuccess('');
    try {
      await deleteQuestion(id);
      setSuccess('Question deleted!');
      loadQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h4>Add Question</h4>
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.5rem' }}>
        <select name="skill_id" value={form.skill_id} onChange={handleFormChange} required>
          <option value="">Select Skill</option>
          {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <textarea name="question" value={form.question} onChange={handleFormChange} placeholder="Question text" required />
        {form.options.map((opt, idx) => (
          <input key={idx} value={opt} onChange={e => handleOptionChange(idx, e.target.value)} placeholder={`Option ${idx + 1}`} required />
        ))}
        <input name="correct_answer" value={form.correct_answer} onChange={handleFormChange} placeholder="Correct answer (must match one option)" required />
        <button type="submit">Add</button>
      </form>
      {error && <div style={{ color: '#d32f2f' }}>{error}</div>}
      {success && <div style={{ color: '#388e3c' }}>{success}</div>}
      <h4>Questions List</h4>
      <div style={{ marginBottom: '1rem' }}>
        <label>Filter by Skill: </label>
        <select value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
          <option value="">All</option>
          {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Skill</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Question</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Options</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Correct</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td>{skills.find(s => s.id === q.skill_id)?.name || q.skill_id}</td>
                <td>
                  {editId === q.id ? (
                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <select name="skill_id" value={editForm.skill_id} onChange={handleEditFormChange} required>
                        <option value="">Select Skill</option>
                        {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <textarea name="question" value={editForm.question} onChange={handleEditFormChange} required />
                      {editForm.options.map((opt, idx) => (
                        <input key={idx} value={opt} onChange={e => handleEditOptionChange(idx, e.target.value)} required />
                      ))}
                      <input name="correct_answer" value={editForm.correct_answer} onChange={handleEditFormChange} required />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditId(null)}>Cancel</button>
                    </form>
                  ) : (
                    q.question
                  )}
                </td>
                <td>{Array.isArray(q.options) ? q.options.join(', ') : (q.options ? JSON.parse(q.options).join(', ') : '')}</td>
                <td>{q.correct_answer}</td>
                <td>
                  <button onClick={() => handleEdit(q)}>Edit</button>
                  <button onClick={() => handleDelete(q.id)} style={{ marginLeft: '0.5rem', color: '#d32f2f' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuestionManagement;
