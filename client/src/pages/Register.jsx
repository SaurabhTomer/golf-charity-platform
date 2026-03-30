import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService.js';
import useAuth from '../hooks/useAuth.js';
import Navbar from '../components/common/Navbar.jsx';

const Register = () => {
  const { login }                   = useAuth();
  const navigate                    = useNavigate();
  const [full_name, setFullName]    = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await registerUser({ full_name, email, password });
      login(res.data.token, res.data.user);
      navigate('/subscribe');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '0 16px' }}>
        <h2>Create Account</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginTop: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginTop: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ display: 'block', width: '100%', padding: '10px', marginTop: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default Register;