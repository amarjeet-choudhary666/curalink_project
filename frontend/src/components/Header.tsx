import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import type { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import LogoutConfirmation from './LogoutConfirmation';

const Header: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { isAuthenticated, user } = authState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Different nav items based on authentication
  const navItems = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ] : [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
    setShowUserMenu(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      // Call logout API (optional - will clear token regardless)
      await import('../services/api').then(({ apiService }) => apiService.logout());
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    }
    
    // Clear local state
    dispatch(logout());
    navigate('/');
    setShowLogoutConfirmation(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-poppins ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600'
      }`} 
      role="banner"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className={`flex items-center text-2xl font-bold transition-all duration-300 hover:scale-105 ${
              isScrolled 
                ? 'text-slate-800 hover:text-blue-600' 
                : 'text-white hover:text-blue-100'
            }`}
            aria-label="CuraLink - Go to homepage"
          >
            <div className="w-8 h-8 mr-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CL</span>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
              CuraLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group ${
                  isScrolled
                    ? isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                    : isActive(item.path)
                      ? 'text-white bg-white/20'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                aria-label={item.label}
              >
                {item.label}
                <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-current transform -translate-x-1/2 transition-all duration-300 group-hover:w-full ${
                  isActive(item.path) ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Dashboard
                </Link>
                
                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isScrolled
                        ? 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span>{user?.name || 'User'}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 min-w-40 rounded-lg shadow-lg border z-50 ${
                      isScrolled ? 'bg-white border-slate-200' : 'bg-white border-slate-200'
                    }`}>
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-slate-200">
                          <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                          <p className="text-xs text-blue-600 font-medium">
                            {user?.role === 'PATIENT' ? 'Patient' : 'Researcher'}
                          </p>
                        </div>
                        
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <span className="flex items-center">
                            <span className="mr-2">👤</span>
                            Edit Profile
                          </span>
                        </Link>
                        
                        <Link
                          to="/favorites"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <span className="flex items-center">
                            <span className="mr-2">⭐</span>
                            My Favorites
                          </span>
                        </Link>
                        
                        {user?.role === 'PATIENT' && (
                          <Link
                            to="/my-meeting-requests"
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                          >
                            <span className="flex items-center">
                              <span className="mr-2">📅</span>
                              My Meetings
                            </span>
                          </Link>
                        )}
                        
                        {user?.role === 'RESEARCHER' && (
                          <Link
                            to="/manage-meeting-requests"
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                          >
                            <span className="flex items-center">
                              <span className="mr-2">📅</span>
                              Meeting Requests
                            </span>
                          </Link>
                        )}
                        
                        <div className="border-t border-slate-200 mt-2 pt-2">
                          <button
                            onClick={handleLogoutClick}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <span className="flex items-center">
                              <span className="mr-2">🚪</span>
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'text-slate-700 hover:text-blue-600 border border-slate-300 hover:border-blue-300'
                      : 'text-blue-100 hover:text-white border border-blue-300 hover:border-white'
                  }`}
                  aria-label="Login to your account"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  aria-label="Create new account"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <nav className={`flex flex-col space-y-2 p-4 rounded-lg ${
            isScrolled ? 'bg-slate-50' : 'bg-white/10 backdrop-blur-sm'
          }`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? isActive(item.path)
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-white'
                    : isActive(item.path)
                      ? 'text-white bg-white/20'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-current/20">
                {/* User Info */}
                <div className="px-4 py-2 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
                    {user?.name}
                  </p>
                  <p className={`text-xs ${isScrolled ? 'text-slate-500' : 'text-blue-100'}`}>
                    {user?.role === 'PATIENT' ? 'Patient' : 'Researcher'}
                  </p>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 ${
                    isScrolled
                      ? 'text-slate-700 hover:text-blue-600 hover:bg-white'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 ${
                    isScrolled
                      ? 'text-slate-700 hover:text-blue-600 hover:bg-white'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Edit Profile
                </Link>
                
                <Link
                  to="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 ${
                    isScrolled
                      ? 'text-slate-700 hover:text-blue-600 hover:bg-white'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  My Favorites
                </Link>
                
                {user?.role === 'RESEARCHER' && (
                  <Link
                    to="/manage-meeting-requests"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 ${
                      isScrolled
                        ? 'text-slate-700 hover:text-blue-600 hover:bg-white'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Meeting Requests
                  </Link>
                )}
                
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-center bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-current/20">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition-all duration-300 ${
                    isScrolled
                      ? 'text-slate-700 hover:text-blue-600 border border-slate-300 hover:border-blue-300'
                      : 'text-blue-100 hover:text-white border border-blue-300 hover:border-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        userName={user?.name}
      />
    </header>
  );
};

export default Header;