import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService.js';
import useAuth from '../hooks/useAuth.js';
import Navbar from '../components/common/Navbar.jsx';

const Login = () => {
  const { login }             = useAuth();
  const navigate              = useNavigate();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '0 16px' }}>
        <h2>Login</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              style={{ display: 'block', width: '100%', padding: '10px', marginTop: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </>
  );
};

export default Login;