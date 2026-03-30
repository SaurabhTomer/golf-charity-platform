import { useState, useEffect } from 'react';
import { getAllCharities, selectCharity, updateContribution } from '../../services/charityService.js';
import useAuth from '../../hooks/useAuth.js';
import CharityCard from './CharityCard.jsx';

const CharityDirectory = () => {
  const { user }                          = useAuth();
  const [charities, setCharities]         = useState([]);
  const [selectedId, setSelectedId]       = useState(user?.charity_id || '');
  const [percent, setPercent]             = useState(user?.charity_percent || 10);
  const [loading, setLoading]             = useState(true);
  const [message, setMessage]             = useState('');
  const [search, setSearch]               = useState('');

  useEffect(() => {
    getAllCharities()
      .then(res => setCharities(res.data.charities))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (id) => {
    try {
      await selectCharity(id);
      setSelectedId(id);
      setMessage('Charity selected!');
    } catch (err) {
      setMessage('Failed to select charity');
    }
  };

  const handlePercentUpdate = async () => {
    try {
      await updateContribution(percent);
      setMessage('Contribution updated!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update');
    }
  };

  // Simple search filter
  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading charities...</p>;

  return (
    <div>
      <h2>Choose Your Charity</h2>

      {message && (
        <p style={{ color: 'green', marginBottom: '16px' }}>{message}</p>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search charities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '16px', boxSizing: 'border-box' }}
      />

      {/* Charity Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {filtered.map(charity => (
          <CharityCard
            key={charity.id}
            charity={charity}
            onSelect={handleSelect}
            selected={selectedId === charity.id}
          />
        ))}
      </div>

      {/* Contribution Percentage */}
      {selectedId && (
        <div style={{ maxWidth: '400px' }}>
          <h3>Your Contribution</h3>
          <p style={{ color: 'gray', fontSize: '14px' }}>
            Minimum 10% of your subscription goes to your chosen charity.
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              min="10"
              max="100"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              style={{ padding: '8px', width: '80px' }}
            />
            <span>%</span>
            <button onClick={handlePercentUpdate}>Update</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharityDirectory;