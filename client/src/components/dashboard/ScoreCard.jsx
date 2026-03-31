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

  useEffect(() => { fetchScores(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this score?')) return;
    try {
      await deleteScore(id);
      fetchScores();
    } catch (err) {
      console.error('Failed to delete score');
    }
  };

  if (loading) return <p className="text-gray-400">Loading scores...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">My Scores</h2>
        <span className="text-sm font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
          {scores.length}/5
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Only your latest 5 scores are kept. Adding a new one removes the oldest.
      </p>

      {scores.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-3">⛳</p>
          <p className="font-medium">No scores yet</p>
          <p className="text-sm">Add your first score below</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date Played</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scores.map((s, index) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="text-lg font-black text-gray-900">{s.score}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(s.played_date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ScoreForm onScoreAdded={fetchScores} />
    </div>
  );
};

export default ScoreCard;