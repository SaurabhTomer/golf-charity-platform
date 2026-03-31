import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import api from '../../services/api.js';

const AdminWinners = () => {
  const [winners, setWinners]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState('');
  const [filter, setFilter]     = useState('all');

  const fetchWinners = () => {
    api.get('/admin/winners')
      .then(res => setWinners(res.data.winners))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWinners(); }, []);

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/admin/winners/${id}/verify`, { status });
      setMessage(`Winner ${status}`);
      fetchWinners();
    } catch (err) {
      setMessage('Action failed');
    }
  };

  const handlePayout = async (id) => {
    if (!window.confirm('Mark this winner as paid?')) return;
    try {
      await api.put(`/admin/winners/${id}/payout`);
      setMessage('Marked as paid');
      fetchWinners();
    } catch (err) {
      setMessage('Failed to update payout');
    }
  };

  const filtered = filter === 'all'
    ? winners
    : winners.filter(w => w.payout_status === filter);

  const statusColor = (status) => {
    if (status === 'paid')     return { background: '#d4edda', color: '#155724' };
    if (status === 'approved') return { background: '#cce5ff', color: '#004085' };
    if (status === 'rejected') return { background: '#f8d7da', color: '#721c24' };
    return { background: '#fff3cd', color: '#856404' };
  };

  return (
    <AdminLayout>
      <h1 style={{ marginTop: 0 }}>Winners</h1>

      {message && (
        <p style={{ color: 'green', background: '#d4edda', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          {message}
        </p>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['all', 'pending', 'approved', 'rejected', 'paid'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: filter === f ? '#111' : '#fff',
              color:      filter === f ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'capitalize'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? <p>Loading winners...</p> : (
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>User</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Draw Month</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Match</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Prize</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Proof</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(winner => (
                <tr key={winner.id} style={{ borderTop: '1px solid #eee' }}>

                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ margin: '0 0 2px', fontWeight: 'bold', fontSize: '14px' }}>
                      {winner.users?.full_name || '—'}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'gray' }}>
                      {winner.users?.email}
                    </p>
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                    {winner.draws?.draw_month
                      ? new Date(winner.draws.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                      : '—'}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                      background: winner.match_type === '5-match' ? '#fff3cd' : '#f5f5f5'
                    }}>
                      {winner.match_type}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>
                    ₹{winner.prize_amount?.toFixed(2)}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    {winner.proof_url ? (
                      <a
                        href={winner.proof_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2196F3', fontSize: '13px' }}
                      >
                        View Proof
                      </a>
                    ) : (
                      <span style={{ color: 'gray', fontSize: '13px' }}>No proof</span>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px',
                      fontSize: '12px', ...statusColor(winner.payout_status)
                    }}>
                      {winner.payout_status}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {winner.payout_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerify(winner.id, 'approved')}
                            style={{
                              background: '#4CAF50', color: '#fff',
                              border: 'none', padding: '4px 8px',
                              borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerify(winner.id, 'rejected')}
                            style={{
                              background: '#f44336', color: '#fff',
                              border: 'none', padding: '4px 8px',
                              borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {winner.payout_status === 'approved' && (
                        <button
                          onClick={() => handlePayout(winner.id)}
                          style={{
                            background: '#9C27B0', color: '#fff',
                            border: 'none', padding: '4px 8px',
                            borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                          }}
                        >
                          Mark Paid
                        </button>
                      )}
                      {(winner.payout_status === 'paid' || winner.payout_status === 'rejected') && (
                        <span style={{ color: 'gray', fontSize: '12px' }}>Done</span>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', padding: '32px', color: 'gray' }}>No winners found.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWinners;