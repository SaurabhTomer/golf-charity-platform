import { useState, useEffect } from 'react';
import { getAllDraws, getUserDrawResult } from '../../services/drawService.js';

const DrawHistory = () => {
  const [draws, setDraws]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDraws()
      .then(res => setDraws(res.data.draws))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading draws...</p>;

  return (
    <div>
      <h2>Draw History</h2>

      {draws.length === 0 ? (
        <p>No draws yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Month</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Numbers</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Jackpot</th>
            </tr>
          </thead>
          <tbody>
            {draws.map(draw => (
              <DrawRow key={draw.id} draw={draw} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Single draw row — checks if user won this draw
const DrawRow = ({ draw }) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (draw.status === 'published') {
      getUserDrawResult(draw.id)
        .then(res => setResult(res.data))
        .catch(() => {});
    }
  }, [draw.id]);

  return (
    <tr style={{ borderBottom: '1px solid #eee' }}>
      <td style={{ padding: '8px' }}>
        {new Date(draw.draw_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
      </td>
      <td style={{ padding: '8px' }}>
        {draw.numbers
          ? draw.numbers.map(n => (
              <span key={n} style={{
                display: 'inline-block',
                background: '#f0f0f0',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                lineHeight: '28px',
                textAlign: 'center',
                marginRight: '4px',
                fontSize: '13px'
              }}>{n}</span>
            ))
          : '—'
        }
      </td>
      <td style={{ padding: '8px' }}>
        <span style={{
          background: draw.status === 'published' ? '#d4edda' : '#fff3cd',
          color:      draw.status === 'published' ? '#155724' : '#856404',
          padding:    '2px 8px',
          borderRadius: '4px',
          fontSize:   '13px'
        }}>
          {draw.status}
        </span>
      </td>
      <td style={{ padding: '8px' }}>
        {result?.won ? (
          <span style={{ color: 'green', fontWeight: 'bold' }}>
            🏆 Won {result.match_type} — ₹{result.prize_amount?.toFixed(2)}
          </span>
        ) : draw.status === 'published' ? (
          <span style={{ color: 'gray', fontSize: '13px' }}>Not won</span>
        ) : (
          <span style={{ color: 'gray', fontSize: '13px' }}>
            ₹{draw.jackpot_pool?.toFixed(2) || '0.00'}
          </span>
        )}
      </td>
    </tr>
  );
};

export default DrawHistory;