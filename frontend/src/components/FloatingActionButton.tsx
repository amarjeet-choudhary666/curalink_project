import React, { useState } from 'react';

interface FloatingActionButtonProps {
  icon: string;
  onClick: () => void;
  tooltip?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  tooltip,
  position = 'bottom-right',
  color = 'primary',
  size = 'md'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const colorClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-14 h-14 text-xl',
    lg: 'w-16 h-16 text-2xl'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          text-white
          rounded-full
          shadow-lg
          hover:shadow-xl
          transform
          hover:scale-110
          active:scale-95
          transition-all
          duration-300
          flex
          items-center
          justify-center
          animate-float
          group
        `}
      >
        <span className="transform group-hover:rotate-12 transition-transform duration-300">
          {icon}
        </span>
      </button>

      {tooltip && showTooltip && (
        <div className={`
          absolute
          ${position.includes('right') ? 'right-full mr-3' : 'left-full ml-3'}
          ${position.includes('bottom') ? 'bottom-0' : 'top-0'}
          bg-gray-800
          text-white
          px-3
          py-2
          rounded-lg
          text-sm
          whitespace-nowrap
          shadow-lg
          animate-fade-in-up
        `}>
          {tooltip}
          <div className={`
            absolute
            top-1/2
            transform
            -translate-y-1/2
            w-2
            h-2
            bg-gray-800
            rotate-45
            ${position.includes('right') ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}
          `}></div>
        </div>
      )}
    </div>
  );
};

export default FloatingActionButton;