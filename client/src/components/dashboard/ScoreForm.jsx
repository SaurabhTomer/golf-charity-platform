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
      onScoreAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <h3 className="text-lg font-bold mb-4">Add New Score</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Stableford Score (1–45)
          </label>
          <input
            type="number"
            min="1"
            max="45"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
            placeholder="Enter score"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Date Played
          </label>
          <input
            type="date"
            value={played_date}
            onChange={(e) => setPlayedDate(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Score'}
        </button>
      </form>
    </div>
  );
};

export default ScoreForm;