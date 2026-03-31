import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import { getAllCharities } from '../services/charityService.js';

const Home = () => {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    getAllCharities()
      .then(res => setCharities(res.data.charities.filter(c => c.is_featured)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wider uppercase">
            ⛳ Golf · Charity · Rewards
          </span>
          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
            Play Golf. <br />
            <span className="text-green-400">Give Back.</span> <br />
            Win Big.
          </h1>
          <p className="text-lg text-white/60 max-w-lg mx-auto mb-10 leading-relaxed">
            Enter your Stableford scores, join monthly prize draws,
            and support the charity you love — all in one place.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/register" className="px-10 py-4 bg-green-400 text-gray-900 font-bold rounded-full text-lg hover:bg-green-300 transition">
              Get Started Free
            </Link>
            <Link to="/charities" className="px-10 py-4 bg-white/10 text-white font-semibold rounded-full text-lg border border-white/20 hover:bg-white/20 transition">
              View Charities
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-10 px-6">
        <div className="max-w-4xl mx-auto flex justify-center gap-16 flex-wrap">
          {[
            { value: '2,000+', label: 'Golfers' },
            { value: '₹10L+',  label: 'Prizes Awarded' },
            { value: '50+',    label: 'Charities' },
            { value: '100%',   label: 'Transparent' }
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-green-400 mb-1">{stat.value}</p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-green-500 font-semibold text-sm mb-3 tracking-widest uppercase">
            How It Works
          </p>
          <h2 className="text-center text-4xl font-black mb-14 text-gray-900">
            Simple. Rewarding. Impactful.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Subscribe',    desc: 'Choose monthly or yearly. A portion of your fee goes to your chosen charity.',         color: 'text-green-400' },
              { step: '02', title: 'Enter Scores', desc: 'Log your latest 5 Stableford scores after every round. Scores are your draw tickets.', color: 'text-yellow-400' },
              { step: '03', title: 'Win & Give',   desc: 'Monthly draws match your scores. 3, 4, or 5 matches each win a different prize tier.', color: 'text-pink-400' }
            ].map(item => (
              <div key={item.step} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <p className={`text-5xl font-black mb-4 ${item.color}`}>{item.step}</p>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Tiers */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-green-500 font-semibold text-sm mb-3 tracking-widest uppercase">
            Prize Tiers
          </p>
          <h2 className="text-center text-4xl font-black mb-12 text-gray-900">
            Three Ways to Win
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { match: '5 Number Match', share: '40%', label: 'Jackpot',     bg: 'bg-yellow-50',  border: 'border-yellow-200', badge: 'bg-yellow-300 text-yellow-900', rollover: true },
              { match: '4 Number Match', share: '35%', label: 'Major Prize', bg: 'bg-green-50',   border: 'border-green-200',  badge: 'bg-green-300 text-green-900'  },
              { match: '3 Number Match', share: '25%', label: 'Prize',       bg: 'bg-pink-50',    border: 'border-pink-200',   badge: 'bg-pink-300 text-pink-900'    }
            ].map(tier => (
              <div key={tier.match} className={`${tier.bg} ${tier.border} border rounded-2xl px-8 py-6 flex justify-between items-center`}>
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className={`${tier.badge} text-xs font-bold px-3 py-1 rounded-full`}>
                      {tier.label}
                    </span>
                    {tier.rollover && (
                      <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Rolls Over
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{tier.match}</h3>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-gray-900">{tier.share}</p>
                  <p className="text-xs text-gray-500">of prize pool</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charities */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-green-500 font-semibold text-sm mb-3 tracking-widest uppercase">
            Charities We Support
          </p>
          <h2 className="text-center text-4xl font-black mb-4 text-gray-900">
            Your Subscription Makes a Difference
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">
            10% of every subscription goes directly to your chosen charity every month.
          </p>

          {charities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {charities.map(charity => (
                <div key={charity.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    ❤️
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{charity.name}</h3>
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{charity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mb-10">
              <p className="text-gray-400">Loading charities...</p>
            </div>
          )}

          <div className="text-center">
            <Link to="/charities" className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition">
              View All Charities →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-black mb-4">Ready to make a difference?</h2>
          <p className="text-white/60 text-lg mb-10">
            Join golfers across India supporting charities and winning prizes every month.
          </p>
          <Link to="/register" className="px-12 py-5 bg-green-400 text-gray-900 font-bold rounded-full text-lg hover:bg-green-300 transition">
            Join Now — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/30 text-sm text-center py-6">
        © 2026 GolfCharity · Built with ❤️ for Indian Golfers
      </footer>
    </div>
  );
};

export default Home;