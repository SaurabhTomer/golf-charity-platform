import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import ScoreCard from '../components/dashboard/ScoreCard.jsx';
import DrawHistory from '../components/dashboard/DrawHistory.jsx';
import WinningsOverview from '../components/dashboard/WinningsOverview.jsx';
import CharityDirectory from '../components/charity/CharityDirectory.jsx';
import useAuth from '../hooks/useAuth.js';
import { getStatus } from '../services/subscriptionService.js';

const TABS = ['Scores', 'Draws', 'Winnings', 'Charity'];

const Dashboard = () => {
  const { user }                        = useAuth();
  const [activeTab, setActiveTab]       = useState('Scores');
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    getStatus()
      .then(res => setSubscription(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              Welcome back, {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500">Manage your scores, draws and charity contributions</p>
          </div>

          {subscription && (
            <div className={`px-5 py-3 rounded-xl border text-sm font-medium ${
              subscription.subscribed
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <p className="font-bold">
                {subscription.subscribed ? '✓ Active Subscription' : '✗ No Subscription'}
              </p>
              {subscription.subscribed && (
                <p className="text-xs mt-0.5 opacity-70">
                  {subscription.plan} · Renews {new Date(subscription.renewal_date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 mb-8 shadow-sm w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {activeTab === 'Scores'   && <ScoreCard />}
          {activeTab === 'Draws'    && <DrawHistory />}
          {activeTab === 'Winnings' && <WinningsOverview />}
          {activeTab === 'Charity'  && <CharityDirectory />}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;