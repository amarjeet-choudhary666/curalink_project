import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const isPatient = user?.role === 'PATIENT';
  const isResearcher = user?.role === 'RESEARCHER';

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/favorites', label: 'Favorites', icon: '⭐' },
  ];

  if (isPatient) {
    navItems.push(
      { to: '/clinical-trials', label: 'Trials', icon: '🔍' },
      { to: '/experts', label: 'Experts', icon: '👨‍⚕️' },
      { to: '/community', label: 'Forums', icon: '💬' }
    );
  } else {
    navItems.push(
      { to: '/collaborators', label: 'Collaborators', icon: '🤝' },
      { to: '/clinical-trials', label: 'Trials', icon: '🧪' },
      { to: '/community', label: 'Forums', icon: '💬' }
    );
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;