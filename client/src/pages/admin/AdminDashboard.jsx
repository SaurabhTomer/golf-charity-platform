import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import api from '../../services/api.js';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, color, icon }) => (
  <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-black text-gray-900 mb-8">Dashboard</h1>

      {loading ? (
        <p className="text-gray-400">Loading stats...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            <StatCard label="Total Users"        value={stats?.total_users || 0}        icon="👥" color="border-l-blue-400" />
            <StatCard label="Active Subscribers" value={stats?.active_subscribers || 0} icon="✅" color="border-l-green-400" />
            <StatCard label="Total Charities"    value={stats?.total_charities || 0}    icon="❤️"  color="border-l-pink-400" />
            <StatCard label="Total Prize Pool"   value={`₹${stats?.total_prize_pool?.toFixed(0) || 0}`} icon="🏆" color="border-l-yellow-400" />
            <StatCard label="Total Paid Out"     value={`₹${stats?.total_paid_out?.toFixed(0) || 0}`}  icon="💸" color="border-l-purple-400" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Manage Users',     path: '/admin/users',     color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: 'Run Draw',         path: '/admin/draws',     color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                { label: 'Add Charity',      path: '/admin/charities', color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
                { label: 'Verify Winners',   path: '/admin/winners',   color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' }
              ].map(action => (
                <Link
                  key={action.path}
                  to={action.path}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${action.color}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;