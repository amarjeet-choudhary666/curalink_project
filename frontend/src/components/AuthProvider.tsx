import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setUser, setLoading, clearAuth } from '../features/auth/authSlice';
import { fetchUserFavorites, clearFavorites } from '../store/favoritesSlice';
import apiService from '../services/api';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user  } = useSelector((state: RootState) => state.auth as any);

  useEffect(() => {
    const initializeAuth = async () => {
      // If we have a token but no user data, try to fetch user data
      if (token && !user) {
        dispatch(setLoading(true));
        
        try {
          // Try to decode the token to get user ID
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const userId = tokenPayload.userId || tokenPayload.id || tokenPayload.sub;
          
          if (userId) {
            const response = await apiService.getUserById(userId);
            
            if (response.success && response.data) {
              dispatch(setUser(response.data));
              // Initialize favorites for the logged-in user
              dispatch(fetchUserFavorites(userId));
            } else {
              console.warn('Failed to fetch user data:', response.message);
              // Token is invalid or user doesn't exist
              dispatch(clearAuth());
              dispatch(clearFavorites());
            }
          } else {
            console.warn('No user ID found in token');
            // Invalid token format
            dispatch(clearAuth());
          }
        } catch (error) {
          console.error('Failed to restore user session:', error);
          // Clear invalid auth data
          dispatch(clearAuth());
          dispatch(clearFavorites());
        } finally {
          dispatch(setLoading(false));
        }
      } else if (user && user.id) {
        dispatch(fetchUserFavorites(user.id));
      } else if (!token && !user) {
        // No auth data, clear favorites
        dispatch(clearFavorites());
      }
    };

    initializeAuth();
  }, [token, user, dispatch]);

  return <>{children}</>;
};

export default AuthProvider;