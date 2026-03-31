import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import api from '../../services/api.js';

const empty = { name: '', description: '', logo_url: '', is_featured: false };

const AdminCharities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [message, setMessage]     = useState('');
  const [form, setForm]           = useState(empty);
  const [editId, setEditId]       = useState(null);
  const [showForm, setShowForm]   = useState(false);

  const fetchCharities = () => {
    api.get('/charities')
      .then(res => setCharities(res.data.charities))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCharities(); }, []);

  const handleSubmit = async () => {
    if (!form.name) return setMessage('Name is required');

    try {
      if (editId) {
        await api.put(`/charities/${editId}`, form);
        setMessage('Charity updated');
      } else {
        await api.post('/charities', form);
        setMessage('Charity created');
      }
      setForm(empty);
      setEditId(null);
      setShowForm(false);
      fetchCharities();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    }
  };

  const handleEdit = (charity) => {
    setForm({
      name:        charity.name,
      description: charity.description || '',
      logo_url:    charity.logo_url || '',
      is_featured: charity.is_featured
    });
    setEditId(charity.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this charity?')) return;
    try {
      await api.delete(`/charities/${id}`);
      setMessage('Charity deactivated');
      fetchCharities();
    } catch (err) {
      setMessage('Failed to deactivate');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Charities</h1>
        <button
          onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}
          style={{
            background: '#111', color: '#fff',
            border: 'none', padding: '10px 20px',
            borderRadius: '6px', cursor: 'pointer'
          }}
        >
          + Add Charity
        </button>
      </div>

      {message && (
        <p style={{ color: 'green', background: '#d4edda', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          {message}
        </p>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginTop: 0 }}>{editId ? 'Edit Charity' : 'Add New Charity'}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
            <div>
              <label style={{ fontSize: '14px' }}>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '14px' }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '14px' }}>Logo URL</label>
              <input
                type="text"
                value={form.logo_url}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                placeholder="https://..."
                style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ddd' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              Featured charity (shown on homepage)
            </label>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSubmit}
                style={{
                  background: '#4CAF50', color: '#fff',
                  border: 'none', padding: '10px 20px',
                  borderRadius: '6px', cursor: 'pointer'
                }}
              >
                {editId ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}
                style={{
                  background: 'none', border: '1px solid #ddd',
                  padding: '10px 20px', borderRadius: '6px', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charities Table */}
      {loading ? <p>Loading charities...</p> : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Description</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Featured</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {charities.map(charity => (
                <tr key={charity.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{charity.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'gray', maxWidth: '200px' }}>
                    {charity.description?.substring(0, 60) || '—'}
                    {charity.description?.length > 60 ? '...' : ''}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {charity.is_featured ? '⭐ Yes' : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                      background: charity.is_active ? '#d4edda' : '#f8d7da',
                      color:      charity.is_active ? '#155724' : '#721c24'
                    }}>
                      {charity.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(charity)}
                        style={{
                          background: '#2196F3', color: '#fff',
                          border: 'none', padding: '4px 10px',
                          borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(charity.id)}
                        style={{
                          background: 'none', border: '1px solid #f44336',
                          color: '#f44336', padding: '4px 10px',
                          borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
                        }}
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {charities.length === 0 && (
            <p style={{ textAlign: 'center', padding: '32px', color: 'gray' }}>No charities yet.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCharities;