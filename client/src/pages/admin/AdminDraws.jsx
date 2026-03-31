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

  const handleMonthChange = (e) => {
    const val = e.target.value; // format: "2026-03"
    if (!val) return;
    // Safely append -01 to make a valid date
    setNewDraw({ ...newDraw, draw_month: val + '-01' });
  };

  // Get the display value for the input (strip the -01)
  const getMonthValue = () => {
    if (!newDraw.draw_month) return '';
    return newDraw.draw_month.slice(0, 7); // "2026-03"
  };

  const handleCreate = async () => {
    if (!newDraw.draw_month) {
      return setMessage('Please select a draw month');
    }
    try {
      await api.post('/draws', newDraw);
      setMessage('Draw created successfully');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-900">Draws</h1>
        <button
          onClick={() => setCreating(!creating)}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition"
        >
          + New Draw
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">
          {message}
        </div>
      )}

      {/* Create Draw Form */}
      {creating && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold mb-5">Create New Draw</h3>
          <div className="flex gap-4 flex-wrap items-end">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Draw Month
              </label>
              <input
                type="month"
                value={getMonthValue()}
                onChange={handleMonthChange}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              {newDraw.draw_month && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Selected: {newDraw.draw_month}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Logic Type
              </label>
              <select
                value={newDraw.logic_type}
                onChange={(e) => setNewDraw({ ...newDraw, logic_type: e.target.value })}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="random">Random</option>
                <option value="algorithmic">Algorithmic</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition"
              >
                Create Draw
              </button>
              <button
                onClick={() => {
                  setCreating(false);
                  setNewDraw({ draw_month: '', logic_type: 'random' });
                }}
                className="px-5 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draws Table */}
      {loading ? (
        <p className="text-gray-400">Loading draws...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Month</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Logic</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Numbers</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Jackpot Pool</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {draws.map(draw => (
                <tr key={draw.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {new Date(draw.draw_month).toLocaleDateString('en-IN', {
                      month: 'long', year: 'numeric'
                    })}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-lg">
                      {draw.logic_type}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {draw.numbers ? (
                      <div className="flex gap-1">
                        {draw.numbers.map(n => (
                          <span key={n} className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {n}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not generated</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      draw.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : draw.status === 'simulated'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {draw.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-gray-900">
                    ₹{draw.jackpot_pool?.toFixed(2) || '0.00'}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {draw.status === 'pending' && (
                        <button
                          onClick={() => handleSimulate(draw.id)}
                          className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition"
                        >
                          Simulate
                        </button>
                      )}
                      {draw.status === 'simulated' && (
                        <>
                          <button
                            onClick={() => handleSimulate(draw.id)}
                            className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition"
                          >
                            Re-simulate
                          </button>
                          <button
                            onClick={() => handlePublish(draw.id)}
                            className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition"
                          >
                            Publish
                          </button>
                        </>
                      )}
                      {draw.status === 'published' && (
                        <span className="text-xs text-gray-400 font-medium">Completed</span>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {draws.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🎯</p>
              <p className="font-medium">No draws yet</p>
              <p className="text-sm">Create your first draw above</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDraws;