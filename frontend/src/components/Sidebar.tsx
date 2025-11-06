import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles?: string[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;

  // If not authenticated, don't show sidebar
  if (!isAuthenticated || !user) {
    return null;
  }

  const isPatient = user?.role === 'PATIENT';
  const isResearcher = user?.role === 'RESEARCHER';

  // Debug logging
  console.log('Sidebar - User:', user);
  console.log('Sidebar - isPatient:', isPatient);
  console.log('Sidebar - isResearcher:', isResearcher);

  // Define navigation items based on CuraLink requirements
  const navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/profile', label: 'My Profile', icon: '👤' },
    { to: '/favorites', label: 'My Favorites', icon: '⭐' },
  ];

  // Patient-specific navigation
  if (isPatient) {
    navItems.push(
      { to: '/clinical-trials', label: 'Clinical Trials', icon: '🔍' },
      { to: '/experts', label: 'Health Experts', icon: '👨‍⚕️' },
      { to: '/my-meeting-requests', label: 'My Meetings', icon: '📅' },
      { to: '/publications', label: 'Publications', icon: '📚' },
      { to: '/community', label: 'Forums', icon: '💬' }
    );
  }

  // Researcher-specific navigation
  if (isResearcher) {
    navItems.push(
      { to: '/collaborators', label: 'Collaborators', icon: '🤝' },
      { to: '/clinical-trials', label: 'Manage Trials', icon: '🧪' },
      { to: '/publications', label: 'Publications', icon: '📚' },
      { to: '/community', label: 'Forums', icon: '💬' },
      { to: '/manage-meeting-requests', label: 'Meeting Requests', icon: '📅' }
    );
  }

  return (
    <aside
      className="hidden md:block bg-white border-r border-slate-200 w-64 h-full overflow-y-auto shadow-sm"
      role="complementary"
      aria-label="Main navigation"
    >
      <div className="p-6">
        {/* User info section at top */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user.name}
              </p>
              <p className={`text-xs font-medium ${
                isPatient ? 'text-green-600' : 'text-blue-600'
              }`}>
                {isPatient ? '🏥 Patient' : '🔬 Researcher'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {isPatient ? 'Patient Portal' : 'Research Portal'}
          </h2>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {isPatient ? (
              <>
                <Link
                  to="/clinical-trials"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <span>🔍</span>
                  <span>Find Trials</span>
                </Link>
                <Link
                  to="/experts"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span>👨‍⚕️</span>
                  <span>Find Experts</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/collaborators"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span>🤝</span>
                  <span>Find Collaborators</span>
                </Link>
                <Link
                  to="/clinical-trials"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <span>➕</span>
                  <span>Add Trial</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Need Help?</h3>
          <p className="text-xs text-slate-600 mb-3">
            {isPatient 
              ? 'Get support finding the right trials and experts for your condition.'
              : 'Get help managing your research and connecting with patients.'
            }
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;