import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
      padding:        '16px 32px',
      borderBottom:   '1px solid #eee',
      background:     '#fff'
    }}>
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '20px', textDecoration: 'none', color: '#000' }}>
        ⛳ GolfCharity
      </Link>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/charities">Charities</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{
              background: '#000', color: '#fff',
              padding: '8px 16px', borderRadius: '6px', textDecoration: 'none'
            }}>
              Get Started
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/draws">Draws</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'purple' }}>Admin</Link>
            )}
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: '1px solid #ddd', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;