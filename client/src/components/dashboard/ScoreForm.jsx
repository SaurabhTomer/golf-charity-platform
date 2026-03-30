import { useState } from 'react';
import { addScore } from '../../services/scoreService.js';

const ScoreForm = ({ onScoreAdded }) => {
  const [score, setScore]           = useState('');
  const [played_date, setPlayedDate] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addScore({ score: Number(score), played_date });
      setScore('');
      setPlayedDate('');
      onScoreAdded(); // refresh scores list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <h3>Add New Score</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Stableford Score (1–45)</label>
        <input
          type="number"
          min="1"
          max="45"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      <div>
        <label>Date Played</label>
        <input
          type="date"
          value={played_date}
          onChange={(e) => setPlayedDate(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Score'}
      </button>
    </form>
  );
};

export default ScoreForm;