import { useState } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import ScoreCard from '../components/dashboard/ScoreCard.jsx';
import DrawHistory from '../components/dashboard/DrawHistory.jsx';
import WinningsOverview from '../components/dashboard/WinningsOverview.jsx';
import CharityDirectory from '../components/charity/CharityDirectory.jsx';
import useAuth from '../hooks/useAuth.js';
import { getStatus } from '../services/subscriptionService.js';
import { useEffect } from 'react';

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
    <>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Welcome + Subscription Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px' }}>Welcome, {user?.full_name} 👋</h1>
            <p style={{ margin: 0, color: 'gray' }}>Manage your scores, draws and charity contributions</p>
          </div>

          {subscription && (
            <div style={{
              background: subscription.subscribed ? '#d4edda' : '#f8d7da',
              padding: '12px 20px', borderRadius: '8px', textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: subscription.subscribed ? '#155724' : '#721c24' }}>
                {subscription.subscribed ? '✓ Active' : '✗ Inactive'}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: 'gray' }}>
                {subscription.plan} · Renews {subscription.renewal_date
                  ? new Date(subscription.renewal_date).toLocaleDateString()
                  : '—'}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '2px solid #eee' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding:      '10px 20px',
                background:   'none',
                border:       'none',
                borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
                fontWeight:   activeTab === tab ? 'bold' : 'normal',
                cursor:       'pointer',
                marginBottom: '-2px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Scores'   && <ScoreCard />}
        {activeTab === 'Draws'    && <DrawHistory />}
        {activeTab === 'Winnings' && <WinningsOverview />}
        {activeTab === 'Charity'  && <CharityDirectory />}

      </div>
    </>
  );
};

export default Dashboard;