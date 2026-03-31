import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

const links = [
  { path: '/admin',            label: 'Dashboard', icon: '📊' },
  { path: '/admin/users',      label: 'Users',     icon: '👥' },
  { path: '/admin/draws',      label: 'Draws',     icon: '🎯' },
  { path: '/admin/charities',  label: 'Charities', icon: '❤️'  },
  { path: '/admin/winners',    label: 'Winners',   icon: '🏆' }
];

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-56 bg-gray-900 text-white flex flex-col fixed h-full">

        {/* Logo */}
        <div className="px-5 py-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-300 rounded-lg flex items-center justify-center text-gray-900 font-black text-sm">G</div>
            <span className="font-bold text-white">GolfCharity</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition ${
                location.pathname === link.path
                  ? 'bg-green-300 text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-3 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full py-2 text-sm text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="ml-56 flex-1 p-8">
        {children}
      </div>

    </div>
  );
};

export default AdminLayout;