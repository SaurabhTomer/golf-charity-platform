import { useState, useEffect } from 'react';
import { getScores, deleteScore, updateScore } from '../../services/scoreService.js';
import ScoreForm from './ScoreForm.jsx';

const ScoreCard = () => {
  const [scores, setScores]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({ score: '', played_date: '' });
  const [message, setMessage]     = useState('');

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

  const handleEditStart = (score) => {
    setEditingId(score.id);
    setEditData({
      score:       score.score,
      played_date: score.played_date
    });
  };

  const handleEditSave = async (id) => {
    try {
      await updateScore(id, {
        score:       Number(editData.score),
        played_date: editData.played_date
      });
      setEditingId(null);
      setMessage('Score updated!');
      fetchScores();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update');
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

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
          {message}
        </div>
      )}

      {scores.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-3">⛳</p>
          <p className="font-medium">No scores yet</p>
          <p className="text-sm">Add your first score below</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date Played</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scores.map((s, index) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-400">{index + 1}</td>

                  <td className="px-4 py-3">
                    {editingId === s.id ? (
                      <input
                        type="number"
                        min="1"
                        max="45"
                        value={editData.score}
                        onChange={(e) => setEditData({ ...editData, score: e.target.value })}
                        className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    ) : (
                      <span className="text-lg font-black text-gray-900">{s.score}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-500">
                    {editingId === s.id ? (
                      <input
                        type="date"
                        value={editData.played_date}
                        onChange={(e) => setEditData({ ...editData, played_date: e.target.value })}
                        className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    ) : (
                      new Date(s.played_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editingId === s.id ? (
                        <>
                          <button
                            onClick={() => handleEditSave(s.id)}
                            className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-50 transition font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditStart(s)}
                            className="text-xs text-blue-500 hover:text-blue-700 font-medium hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
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