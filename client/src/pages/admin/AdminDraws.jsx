import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import api from '../../services/api.js';

const AdminDraws = () => {
  const [draws, setDraws]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState('');
  const [creating, setCreating] = useState(false);

  const [newDraw, setNewDraw] = useState({
    draw_month: '',
    logic_type: 'random'
  });

  const fetchDraws = () => {
    api.get('/draws')
      .then(res => setDraws(res.data.draws))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDraws(); }, []);

  const handleCreate = async () => {
    if (!newDraw.draw_month) return setMessage('Please select a draw month');
    try {
      await api.post('/draws', newDraw);
      setMessage('Draw created');
      setCreating(false);
      setNewDraw({ draw_month: '', logic_type: 'random' });
      fetchDraws();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create draw');
    }
  };

  const handleSimulate = async (id) => {
    try {
      const res = await api.post(`/draws/${id}/simulate`);
      setMessage(`Simulated numbers: ${res.data.numbers.join(', ')}`);
      fetchDraws();
    } catch (err) {
      setMessage('Simulation failed');
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm('Publish this draw? This will find all winners and cannot be undone.')) return;
    try {
      const res = await api.post(`/draws/${id}/publish`);
      setMessage(`Draw published! Winners found: ${Object.values(res.data.winners).flat().length}`);
      fetchDraws();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Publish failed');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Draws</h1>
        <button
          onClick={() => setCreating(!creating)}
          style={{
            background: '#111', color: '#fff',
            border: 'none', padding: '10px 20px',
            borderRadius: '6px', cursor: 'pointer'
          }}
        >
          + New Draw
        </button>
      </div>

      {message && (
        <p style={{ color: 'green', marginBottom: '16px', background: '#d4edda', padding: '10px', borderRadius: '6px' }}>
          {message}
        </p>
      )}

      {/* Create Draw Form */}
      {creating && (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginTop: 0 }}>Create New Draw</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Draw Month</label>
              <input
                type="month"
                value={newDraw.draw_month}
                onChange={(e) => setNewDraw({ ...newDraw, draw_month: e.target.value + '-01' })}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Logic Type</label>
              <select
                value={newDraw.logic_type}
                onChange={(e) => setNewDraw({ ...newDraw, logic_type: e.target.value })}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="random">Random</option>
                <option value="algorithmic">Algorithmic</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              style={{
                background: '#4CAF50', color: '#fff',
                border: 'none', padding: '10px 20px',
                borderRadius: '6px', cursor: 'pointer'
              }}
            >
              Create
            </button>
            <button
              onClick={() => setCreating(false)}
              style={{
                background: 'none', border: '1px solid #ddd',
                padding: '10px 20px', borderRadius: '6px', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Draws Table */}
      {loading ? <p>Loading draws...</p> : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Month</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Logic</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Numbers</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Jackpot Pool</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {draws.map(draw => (
                <tr key={draw.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px' }}>
                    {new Date(draw.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px', textTransform: 'capitalize', fontSize: '13px' }}>
                    {draw.logic_type}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {draw.numbers ? (
                      draw.numbers.map(n => (
                        <span key={n} style={{
                          display: 'inline-block',
                          background: '#111', color: '#fff',
                          borderRadius: '50%', width: '26px', height: '26px',
                          lineHeight: '26px', textAlign: 'center',
                          marginRight: '4px', fontSize: '12px'
                        }}>
                          {n}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'gray', fontSize: '13px' }}>Not generated</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                      background:
                        draw.status === 'published' ? '#d4edda' :
                        draw.status === 'simulated' ? '#fff3cd' : '#f5f5f5',
                      color:
                        draw.status === 'published' ? '#155724' :
                        draw.status === 'simulated' ? '#856404' : '#333'
                    }}>
                      {draw.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    ₹{draw.jackpot_pool?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {draw.status === 'pending' && (
                        <button
                          onClick={() => handleSimulate(draw.id)}
                          style={{
                            background: '#FF9800', color: '#fff',
                            border: 'none', padding: '4px 10px',
                            borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
                          }}
                        >
                          Simulate
                        </button>
                      )}
                      {draw.status === 'simulated' && (
                        <>
                          <button
                            onClick={() => handleSimulate(draw.id)}
                            style={{
                              background: '#FF9800', color: '#fff',
                              border: 'none', padding: '4px 10px',
                              borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
                            }}
                          >
                            Re-simulate
                          </button>
                          <button
                            onClick={() => handlePublish(draw.id)}
                            style={{
                              background: '#4CAF50', color: '#fff',
                              border: 'none', padding: '4px 10px',
                              borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
                            }}
                          >
                            Publish
                          </button>
                        </>
                      )}
                      {draw.status === 'published' && (
                        <span style={{ color: 'gray', fontSize: '13px' }}>Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {draws.length === 0 && (
            <p style={{ textAlign: 'center', padding: '32px', color: 'gray' }}>No draws yet. Create one above.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDraws;