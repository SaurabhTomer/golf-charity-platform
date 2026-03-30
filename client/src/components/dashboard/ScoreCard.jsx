import { useState, useEffect } from 'react';
import { getScores, deleteScore } from '../../services/scoreService.js';
import ScoreForm from './ScoreForm.jsx';

const ScoreCard = () => {
  const [scores, setScores]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const res = await getScores();
      setScores(res.data.scores);
    } catch (err) {
      console.error('Failed to fetch scores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this score?')) return;
    try {
      await deleteScore(id);
      fetchScores();
    } catch (err) {
      console.error('Failed to delete score');
    }
  };

  if (loading) return <p>Loading scores...</p>;

  return (
    <div>
      <h2>My Scores ({scores.length}/5)</h2>
      <p style={{ color: 'gray', fontSize: '14px' }}>
        Only your latest 5 scores are kept. Adding a new one removes the oldest.
      </p>

      {scores.length === 0 ? (
        <p>No scores yet. Add your first score below.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Score</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Date Played</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, index) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{index + 1}</td>
                <td style={{ padding: '8px' }}><strong>{s.score}</strong></td>
                <td style={{ padding: '8px' }}>{new Date(s.played_date).toLocaleDateString()}</td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => handleDelete(s.id)}
                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {scores.length < 5 && (
        <ScoreForm onScoreAdded={fetchScores} />
      )}

      {scores.length === 5 && (
        <ScoreForm onScoreAdded={fetchScores} />
      )}
    </div>
  );
};

export default ScoreCard;