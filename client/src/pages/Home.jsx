import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-28 px-6 text-center">
        <div className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-green-300 font-medium mb-6">
          ⛳ Golf · Charity · Rewards
        </div>
        <h1 className="text-6xl font-black leading-tight mb-6 max-w-3xl mx-auto">
          Play Golf. <br />
          <span className="text-green-300">Give Back.</span> <br />
          Win Big.
        </h1>
        <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
          Enter your Stableford scores, join monthly prize draws,
          and support the charity you love.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="px-10 py-4 bg-green-300 text-gray-900 font-bold rounded-full text-lg hover:bg-green-200 transition">
            Get Started Free
          </Link>
          <Link to="/charities" className="px-10 py-4 bg-white/10 text-white font-semibold rounded-full text-lg border border-white/20 hover:bg-white/20 transition">
            View Charities
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 py-10 px-6">
        <div className="max-w-4xl mx-auto flex justify-center gap-16 flex-wrap">
          {[
            { value: '2,000+', label: 'Golfers' },
            { value: '₹10L+',  label: 'Prizes Awarded' },
            { value: '50+',    label: 'Charities' },
            { value: '100%',   label: 'Transparent' }
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-green-300 mb-1">{stat.value}</p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="py-24 px-6 max-w-5xl mx-auto">
        <p className="text-center text-green-500 font-semibold text-sm mb-3 tracking-widest uppercase">How it works</p>
        <h2 className="text-center text-4xl font-black mb-14">Simple. Rewarding. Impactful.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Subscribe',     desc: 'Choose monthly or yearly. A portion of your fee goes to your chosen charity.',         color: 'text-green-400' },
            { step: '02', title: 'Enter Scores',  desc: 'Log your latest 5 Stableford scores after every round. Scores are your draw tickets.', color: 'text-yellow-400' },
            { step: '03', title: 'Win & Give',    desc: 'Monthly draws match your scores. 3, 4, or 5 matches each win a different prize tier.', color: 'text-pink-400' }
          ].map(item => (
            <div key={item.step} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
              <p className={`text-5xl font-black mb-4 ${item.color}`}>{item.step}</p>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prize Tiers */}
      <div className="bg-gray-50 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-green-500 font-semibold text-sm mb-3 tracking-widest uppercase">Prize Tiers</p>
          <h2 className="text-center text-4xl font-black mb-12">Three Ways to Win</h2>
          <div className="flex flex-col gap-4">
            {[
              { match: '5 Number Match', share: '40%', label: 'Jackpot',     bg: 'bg-yellow-50',  border: 'border-yellow-200', badge: 'bg-yellow-300' },
              { match: '4 Number Match', share: '35%', label: 'Major Prize', bg: 'bg-green-50',   border: 'border-green-200',  badge: 'bg-green-300'  },
              { match: '3 Number Match', share: '25%', label: 'Prize',       bg: 'bg-pink-50',    border: 'border-pink-200',   badge: 'bg-pink-300'   }
            ].map(tier => (
              <div key={tier.match} className={`${tier.bg} ${tier.border} border rounded-xl px-8 py-6 flex justify-between items-center`}>
                <div>
                  <span className={`${tier.badge} text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block`}>
                    {tier.label}
                  </span>
                  <h3 className="text-lg font-bold">{tier.match}</h3>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black">{tier.share}</p>
                  <p className="text-xs text-gray-500">of prize pool</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-24 px-6 text-center">
        <h2 className="text-5xl font-black mb-4">Ready to make a difference?</h2>
        <p className="text-white/60 text-lg mb-10">
          Join golfers across India supporting charities and winning prizes every month.
        </p>
        <Link to="/register" className="px-12 py-5 bg-green-300 text-gray-900 font-bold rounded-full text-lg hover:bg-green-200 transition">
          Join Now — It's Free
        </Link>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white/30 text-sm text-center py-6">
        © 2026 GolfCharity. All rights reserved.
      </div>
    </div>
  );
};

export default Home;