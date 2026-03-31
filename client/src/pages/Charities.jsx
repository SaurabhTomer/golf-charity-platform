import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllCharities, selectCharity } from '../services/charityService.js';
import Navbar from '../components/common/Navbar.jsx';
import useAuth from '../hooks/useAuth.js';

const Charities = () => {
  const [charities, setCharities]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage]       = useState('');
  const [searchParams]              = useSearchParams();
  const navigate                    = useNavigate();
  const { user }                    = useAuth();
  const isSelectMode                = searchParams.get('select') === 'true';

  useEffect(() => {
    getAllCharities()
      .then(res => setCharities(res.data.charities))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (id) => {
    try {
      await selectCharity(id);
      setSelectedId(id);
      setMessage('Charity selected!');

      // If coming from register redirect to subscribe
      if (isSelectMode) {
        setTimeout(() => navigate('/subscribe'), 1000);
      }
    } catch (err) {
      setMessage('Failed to select charity');
    }
  };

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered.filter(c => c.is_featured);
  const rest     = filtered.filter(c => !c.is_featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Select mode banner */}
        {isSelectMode && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <span className="text-3xl">👋</span>
            <div>
              <p className="font-bold text-green-800">Welcome! One last step</p>
              <p className="text-sm text-green-600">
                Please select a charity to support with your subscription before continuing.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-gray-900">Our Charities</h1>
          {isSelectMode && selectedId && (
            <button
              onClick={() => navigate('/subscribe')}
              className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition text-sm"
            >
              Continue to Subscribe →
            </button>
          )}
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Search charities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 mb-8"
        />

        {loading ? (
          <p className="text-gray-400 text-center py-12">Loading charities...</p>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">⭐ Featured</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {featured.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect(c.id)}
                      className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition hover:shadow-md ${
                        selectedId === c.id || user?.charity_id === c.id
                          ? 'border-green-400 bg-green-50'
                          : 'border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                          ❤️
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{c.name}</h3>
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{c.description}</p>
                          {(selectedId === c.id || user?.charity_id === c.id) && (
                            <p className="text-xs text-green-600 font-bold mt-2">✓ Selected</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* All charities */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">All Charities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rest.map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition hover:shadow-md ${
                    selectedId === c.id || user?.charity_id === c.id
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      ❤️
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{c.name}</h3>
                      <p className="text-sm text-gray-500">{c.description}</p>
                      {(selectedId === c.id || user?.charity_id === c.id) && (
                        <p className="text-xs text-green-600 font-bold mt-2">✓ Selected</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-12">No charities found</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Charities;