import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const WinningsOverview = () => {
  const [winners, setWinners]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(null);
  const [message, setMessage]     = useState('');

  useEffect(() => {
    api.get('/admin/my-winnings')
      .then(res => setWinners(res.data.winnings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProofUpload = async (winnerId, file) => {
    if (!file) return;
    setUploading(winnerId);

    try {
      // Upload to Supabase storage via backend
      const formData = new FormData();
      formData.append('proof', file);

      const res = await api.post(`/winners/${winnerId}/proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Proof uploaded successfully!');
      // Refresh winners
      const updated = await api.get('/admin/my-winnings');
      setWinners(updated.data.winnings);
    } catch (err) {
      setMessage('Failed to upload proof');
    } finally {
      setUploading(null);
    }
  };

  const totalWon = winners.reduce((sum, w) => sum + (w.prize_amount || 0), 0);

  if (loading) return <p className="text-gray-400">Loading winnings...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">My Winnings</h2>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
          {message}
        </div>
      )}

      {/* Total won card */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6 inline-block border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Total Won</p>
        <p className="text-4xl font-black text-gray-900">₹{totalWon.toFixed(2)}</p>
      </div>

      {winners.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🏆</p>
          <p className="font-medium">No winnings yet</p>
          <p className="text-sm">Keep playing — your time will come!</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Draw Month</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Match</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prize</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {winners.map(w => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(w.draws?.draw_month).toLocaleDateString('en-IN', {
                      month: 'long', year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      {w.match_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-black text-gray-900">
                    ₹{w.prize_amount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      w.payout_status === 'paid'     ? 'bg-green-100 text-green-700' :
                      w.payout_status === 'approved' ? 'bg-blue-100 text-blue-700'  :
                      w.payout_status === 'rejected' ? 'bg-red-100 text-red-700'    :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {w.payout_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {w.proof_url ? (
                      <a
                        href={w.proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-500 hover:underline font-medium"
                      >
                        View Proof
                      </a>
                    ) : w.payout_status === 'pending' ? (
                      <label className="cursor-pointer">
                        <span className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">
                          {uploading === w.id ? 'Uploading...' : 'Upload Proof'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleProofUpload(w.id, e.target.files[0])}
                          disabled={uploading === w.id}
                        />
                      </label>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WinningsOverview;