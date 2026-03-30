import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const WinningsOverview = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/my-winnings')
      .then(res => setWinners(res.data.winnings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalWon = winners.reduce((sum, w) => sum + (w.prize_amount || 0), 0);

  if (loading) return <p>Loading winnings...</p>;

  return (
    <div>
      <h2>My Winnings</h2>

      <div style={{
        background: '#f9f9f9', borderRadius: '8px',
        padding: '16px', marginBottom: '24px',
        display: 'inline-block'
      }}>
        <p style={{ margin: 0, color: 'gray', fontSize: '14px' }}>Total Won</p>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>₹{totalWon.toFixed(2)}</p>
      </div>

      {winners.length === 0 ? (
        <p>No winnings yet. Keep playing!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Draw Month</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Match</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Prize</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {winners.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>
                  {new Date(w.draws?.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </td>
                <td style={{ padding: '8px' }}>{w.match_type}</td>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>₹{w.prize_amount?.toFixed(2)}</td>
                <td style={{ padding: '8px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '4px', fontSize: '13px',
                    background: w.payout_status === 'paid' ? '#d4edda' : '#fff3cd',
                    color:      w.payout_status === 'paid' ? '#155724' : '#856404'
                  }}>
                    {w.payout_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WinningsOverview;