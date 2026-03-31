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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-green-300 font-black text-lg">
            G
          </div>
          <span className="font-bold text-lg text-gray-900">
            Golf<span className="text-green-400">Charity</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2">
          <Link to="/charities" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition">
            Charities
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 transition">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition">
                Dashboard
              </Link>
              <Link to="/draws" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition">
                Draws
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 ml-2">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center font-bold text-sm text-gray-900">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;