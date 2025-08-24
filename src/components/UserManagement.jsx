import React, { useEffect, useState } from 'react';
import { fetchUsers, addUser, updateUser, deleteUser } from '../services/userService';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await addUser(form);
      setSuccess('User added!');
      setForm({ name: '', email: '', password: '', role: 'user' });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Add failed');
    }
  };

  const handleEdit = (u) => {
    setEditId(u.id);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateUser(editId, editForm);
      setSuccess('User updated!');
      setEditId(null);
      setEditForm({ name: '', email: '', role: 'user' });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setError(''); setSuccess('');
    try {
      await deleteUser(id);
      setSuccess('User deleted!');
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h4>Add User</h4>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email" type="email" required />
        <input name="password" value={form.password} onChange={handleFormChange} placeholder="Password" type="password" required />
        <select name="role" value={form.role} onChange={handleFormChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add</button>
      </form>
      {error && <div style={{ color: '#d32f2f' }}>{error}</div>}
      {success && <div style={{ color: '#388e3c' }}>{success}</div>}
      <h4>Users List</h4>
      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Name</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Email</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Role</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  {editId === u.id ? (
                    <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input name="name" value={editForm.name} onChange={handleEditFormChange} required />
                      <input name="email" value={editForm.email} onChange={handleEditFormChange} required />
                      <select name="role" value={editForm.role} onChange={handleEditFormChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditId(null)}>Cancel</button>
                    </form>
                  ) : (
                    u.name
                  )}
                </td>
                <td>{editId === u.id ? null : u.email}</td>
                <td>{editId === u.id ? null : u.role}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Edit</button>
                  <button onClick={() => handleDelete(u.id)} style={{ marginLeft: '0.5rem', color: '#d32f2f' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserManagement;
