import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 16px', background: '#f9f9f9' }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 16px' }}>Golf. Give. Win.</h1>
        <p style={{ fontSize: '20px', color: 'gray', maxWidth: '600px', margin: '0 auto 32px' }}>
          Enter your golf scores, participate in monthly draws, and support a charity you love — all in one place.
        </p>
        <Link to="/register" style={{
          background: '#000', color: '#fff',
          padding: '16px 40px', borderRadius: '8px',
          textDecoration: 'none', fontSize: '18px'
        }}>
          Get Started
        </Link>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 16px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { step: '1', title: 'Subscribe', desc: 'Choose monthly or yearly plan and get access to the platform.' },
            { step: '2', title: 'Enter Scores', desc: 'Log your latest Stableford scores after every round.' },
            { step: '3', title: 'Win & Give', desc: 'Match draw numbers to win prizes. A portion goes to charity.' }
          ].map(item => (
            <div key={item.step}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#000', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: 'bold', margin: '0 auto 16px'
              }}>
                {item.step}
              </div>
              <h3>{item.title}</h3>
              <p style={{ color: 'gray' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#000', color: '#fff', textAlign: 'center', padding: '60px 16px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Ready to make a difference?</h2>
        <p style={{ color: '#aaa', marginBottom: '32px' }}>
          Join hundreds of golfers already supporting charities and winning prizes.
        </p>
        <Link to="/register" style={{
          background: '#fff', color: '#000',
          padding: '14px 36px', borderRadius: '8px',
          textDecoration: 'none', fontWeight: 'bold'
        }}>
          Join Now
        </Link>
      </div>
    </>
  );
};

export default Home;