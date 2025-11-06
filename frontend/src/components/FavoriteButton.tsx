import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { selectFavoriteTrials, selectFavoriteResearchers, selectFavoritePublications } from '../store/favoritesSlice';

interface FavoriteButtonProps {
  type: 'trial' | 'researcher' | 'publication';
  itemId: string;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  disabled?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  type,
  itemId,
  onToggle,
  className = '',
  size = 'md',
  showLabel = false,
  disabled = false,
}) => {
  // Get favorites arrays from Redux state
  const favoriteTrials = useSelector((state: RootState) => selectFavoriteTrials(state));
  const favoriteResearchers = useSelector((state: RootState) => selectFavoriteResearchers(state));
  const favoritePublications = useSelector((state: RootState) => selectFavoritePublications(state));
  
  // Check if current item is favorited
  const isFavorited = type === 'trial' ? favoriteTrials.includes(itemId) : 
                     type === 'researcher' ? favoriteResearchers.includes(itemId) : 
                     favoritePublications.includes(itemId);

  // Debug logging
  React.useEffect(() => {
    console.log(`FavoriteButton Debug - Type: ${type}, ItemId: ${itemId}, IsFavorited: ${isFavorited}`);
    console.log('Favorites arrays:', { favoriteTrials, favoriteResearchers, favoritePublications });
  }, [type, itemId, isFavorited, favoriteTrials, favoriteResearchers, favoritePublications]);

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-lg',
  };

  const iconSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
          onToggle();
        }
      }}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center
        rounded-full transition-all duration-200
        ${isFavorited 
          ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 border-2 border-yellow-300' 
          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-yellow-500 border-2 border-gray-200'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className={`${iconSize[size]} ${isFavorited ? 'text-yellow-500' : 'text-gray-400'}`}>
        {isFavorited ? '⭐' : '☆'}
      </span>
      {showLabel && (
        <span className={`ml-2 text-sm font-medium ${isFavorited ? 'text-yellow-600' : 'text-gray-600'}`}>
          {isFavorited ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;