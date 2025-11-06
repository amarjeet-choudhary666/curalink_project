import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  fetchUserFavorites,
  addTrialFavorite,
  removeTrialFavorite,
  addResearcherFavorite,
  removeResearcherFavorite,
  addPublicationFavorite,
  removePublicationFavorite,
  selectIsTrialFavorited,
  selectIsResearcherFavorited,
  selectIsPublicationFavorited,
  selectFavoriteTrials,
  selectFavoriteResearchers,
  selectFavoritePublications,
  selectFavoritesLoading,
  selectFavoritesError,
} from '../store/favoritesSlice';

export const useFavorites = (userId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const favoriteTrials = useSelector((state: RootState) => selectFavoriteTrials(state));
  const favoriteResearchers = useSelector((state: RootState) => selectFavoriteResearchers(state));
  const favoritePublications = useSelector((state: RootState) => selectFavoritePublications(state));
  const isLoading = useSelector((state: RootState) => selectFavoritesLoading(state));
  const error = useSelector((state: RootState) => selectFavoritesError(state));
  const lastFetched = useSelector((state: RootState) => state.favorites.lastFetched);

  // Auto-fetch favorites when userId is available and data is stale
  useEffect(() => {
    if (userId && (!lastFetched || Date.now() - lastFetched > 5 * 60 * 1000)) { // 5 minutes cache
      dispatch(fetchUserFavorites(userId));
    }
  }, [userId, lastFetched, dispatch]);

  // Helper functions to check if items are favorited
  const isTrialFavorited = (trialId: string) => {
    return favoriteTrials.includes(trialId);
  };

  const isResearcherFavorited = (researcherId: string) => {
    return favoriteResearchers.includes(researcherId);
  };

  const isPublicationFavorited = (publicationId: string) => {
    return favoritePublications.includes(publicationId);
  };

  // Action functions
  const toggleTrialFavorite = async (trialId: string) => {
    if (!userId) return;
    
    const isFavorited = favoriteTrials.includes(trialId);
    if (isFavorited) {
      await dispatch(removeTrialFavorite({ userId, trialId }));
    } else {
      await dispatch(addTrialFavorite({ userId, trialId }));
    }
  };

  const toggleResearcherFavorite = async (researcherId: string) => {
    if (!userId) return;
    
    const isFavorited = favoriteResearchers.includes(researcherId);
    if (isFavorited) {
      await dispatch(removeResearcherFavorite({ userId, researcherId }));
    } else {
      await dispatch(addResearcherFavorite({ userId, researcherId }));
    }
  };

  const togglePublicationFavorite = async (publicationId: string) => {
    if (!userId) return;
    
    const isFavorited = favoritePublications.includes(publicationId);
    if (isFavorited) {
      await dispatch(removePublicationFavorite({ userId, publicationId }));
    } else {
      await dispatch(addPublicationFavorite({ userId, publicationId }));
    }
  };

  const refreshFavorites = () => {
    if (userId) {
      dispatch(fetchUserFavorites(userId));
    }
  };

  return {
    // State
    favoriteTrials,
    favoriteResearchers,
    favoritePublications,
    isLoading,
    error,
    
    // Checkers
    isTrialFavorited,
    isResearcherFavorited,
    isPublicationFavorited,
    
    // Actions
    toggleTrialFavorite,
    toggleResearcherFavorite,
    togglePublicationFavorite,
    refreshFavorites,
    
    // Counts
    totalFavorites: favoriteTrials.length + favoriteResearchers.length + favoritePublications.length,
  };
};

// Individual hooks for specific favorite checks (these work with selectors)
export const useIsTrialFavorited = (trialId: string) => {
  return useSelector((state: RootState) => selectIsTrialFavorited(state, trialId));
};

export const useIsResearcherFavorited = (researcherId: string) => {
  return useSelector((state: RootState) => selectIsResearcherFavorited(state, researcherId));
};

export const useIsPublicationFavorited = (publicationId: string) => {
  return useSelector((state: RootState) => selectIsPublicationFavorited(state, publicationId));
};