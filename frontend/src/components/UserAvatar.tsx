import React from 'react';

interface UserAvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name = 'User', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg'
  };

  const initials = name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`
      ${sizeClasses[size]}
      bg-gradient-to-r from-blue-500 to-purple-600 
      rounded-full 
      flex items-center justify-center 
      text-white font-bold
      ${className}
    `}>
      {initials}
    </div>
  );
};

export default UserAvatar;