import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import api from '../../services/api.js';

const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [message, setMessage] = useState('');

  const fetchUsers = () => {
    api.get('/admin/users')
      .then(res => setUsers(res.data.users))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role });
      setMessage('User role updated');
      fetchUsers();
    } catch (err) {
      setMessage('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMessage('User deleted');
      fetchUsers();
    } catch (err) {
      setMessage('Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 style={{ marginTop: 0 }}>Users</h1>

      {message && (
        <p style={{ color: 'green', marginBottom: '16px' }}>{message}</p>
      )}

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '16px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ddd' }}
      />

      {loading ? <p>Loading users...</p> : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Role</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Subscription</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Joined</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px' }}>{user.full_name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {user.subscriptions?.[0] ? (
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                        background: user.subscriptions[0].status === 'active' ? '#d4edda' : '#f8d7da',
                        color:      user.subscriptions[0].status === 'active' ? '#155724' : '#721c24'
                      }}>
                        {user.subscriptions[0].plan} — {user.subscriptions[0].status}
                      </span>
                    ) : (
                      <span style={{ color: 'gray', fontSize: '13px' }}>No subscription</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'gray' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        background: 'none', border: '1px solid #f44336',
                        color: '#f44336', padding: '4px 10px',
                        borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', padding: '32px', color: 'gray' }}>No users found</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;