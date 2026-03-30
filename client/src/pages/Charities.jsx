import { useState, useEffect } from 'react';
import { getAllCharities } from '../services/charityService.js';
import Navbar from '../components/common/Navbar.jsx';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    getAllCharities()
      .then(res => setCharities(res.data.charities))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const featured  = filtered.filter(c => c.is_featured);
  const rest      = filtered.filter(c => !c.is_featured);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        <h1>Our Charities</h1>
        <p style={{ color: 'gray' }}>
          Choose a charity to support with a portion of your subscription.
        </p>

        <input
          type="text"
          placeholder="Search charities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', width: '100%', marginBottom: '32px', boxSizing: 'border-box' }}
        />

        {loading ? <p>Loading...</p> : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <>
                <h2>Featured</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                  {featured.map(c => (
                    <div key={c.id} style={{ border: '2px solid gold', borderRadius: '8px', padding: '16px' }}>
                      {c.logo_url && <img src={c.logo_url} alt={c.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />}
                      <h3>{c.name}</h3>
                      <p style={{ color: 'gray', fontSize: '14px' }}>{c.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* All charities */}
            <h2>All Charities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {rest.map(c => (
                <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
                  {c.logo_url && <img src={c.logo_url} alt={c.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />}
                  <h3>{c.name}</h3>
                  <p style={{ color: 'gray', fontSize: '14px' }}>{c.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Charities;