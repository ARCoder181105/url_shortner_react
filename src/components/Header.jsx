import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link2, User, LogOut, BarChart3 } from 'lucide-react';

const Header = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/logout`,
        {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      onLogout(); // clear local state
      navigate('/'); // redirect after success
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo links to the home page */}
        <Link to="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Link2 className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">ShortURL</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {/* Dashboard Link */}
              <Link
                to="/admin"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/admin'
                    ? 'text-blue-600 bg-blue-50 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogoutClick}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            // Admin Login Link
            <Link
              to="/login"
              className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <User className="h-4 w-4" />
              <span>Admin Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;