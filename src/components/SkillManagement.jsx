import React, { useEffect, useState } from 'react';
import { fetchSkills, addSkill, updateSkill, deleteSkill } from '../services/skillService';

function SkillManagement() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await fetchSkills();
      setSkills(data.skills);
    } catch (err) {
      setError('Failed to load skills');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await addSkill(name);
      setSuccess('Skill added!');
      setName('');
      loadSkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Add failed');
    }
  };

  const handleEdit = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateSkill(editId, editName);
      setSuccess('Skill updated!');
      setEditId(null);
      setEditName('');
      loadSkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    setError(''); setSuccess('');
    try {
      await deleteSkill(id);
      setSuccess('Skill deleted!');
      loadSkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h4>Add Skill</h4>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Skill name" required />
        <button type="submit">Add</button>
      </form>
      {error && <div style={{ color: '#d32f2f' }}>{error}</div>}
      {success && <div style={{ color: '#388e3c' }}>{success}</div>}
      <h4>Skills List</h4>
      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(skill => (
              <tr key={skill.id}>
                <td>
                  {editId === skill.id ? (
                    <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input value={editName} onChange={e => setEditName(e.target.value)} required />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditId(null)}>Cancel</button>
                    </form>
                  ) : (
                    skill.name
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(skill.id, skill.name)}>Edit</button>
                  <button onClick={() => handleDelete(skill.id)} style={{ marginLeft: '0.5rem', color: '#d32f2f' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SkillManagement;
