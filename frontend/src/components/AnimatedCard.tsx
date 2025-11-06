import React, { useEffect, useState } from 'react';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon?: string;
  gradient?: string;
  delay?: number;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  description,
  icon,
  gradient = 'from-blue-500 to-purple-600',
  delay = 0,
  onClick,
  className = '',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
    >
      <div
        className={`relative group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 card-hover ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          {icon && (
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
          <p className="text-slate-600 leading-relaxed mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedCard;