import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

interface FavoritesState {
  favoriteTrials: string[];
  favoriteResearchers: string[];
  favoritePublications: string[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: FavoritesState = {
  favoriteTrials: [],
  favoriteResearchers: [],
  favoritePublications: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Async thunk to fetch user favorites
export const fetchUserFavorites = createAsyncThunk(
  'favorites/fetchUserFavorites',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserFavorites(userId);
      if (response.success && response.data) {
        console.log('Favorites API Response:', response.data);
        return {
          trials: response.data.trials?.map((fav: any) => {

            const trialId = fav.trialId || fav.trial?.id;
            console.log('Processing trial favorite:', { fav, trialId });
            return trialId;
          }).filter(Boolean) || [],
          researchers: response.data.researchers?.map((fav: any) => {
            // Extract the actual researcher ID from the favorite record
            const researcherId = fav.researcherId || fav.researcher?.id || fav.researcher?.userId;
            console.log('Processing researcher favorite:', { fav, researcherId });
            return researcherId;
          }).filter(Boolean) || [],
          publications: response.data.publications?.map((fav: any) => {
            // Extract the actual publication ID from the favorite record
            const publicationId = fav.publicationId || fav.publication?.id;
            console.log('Processing publication favorite:', { fav, publicationId });
            return publicationId;
          }).filter(Boolean) || [],
        };
      }
      throw new Error(response.message || 'Failed to fetch favorites');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch favorites');
    }
  }
);

// Async thunk to add trial favorite
export const addTrialFavorite = createAsyncThunk(
  'favorites/addTrialFavorite',
  async ({ userId, trialId }: { userId: string; trialId: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.addFavoriteTrial(userId, trialId);
      if (response.success) {
        return trialId;
      }
      throw new Error(response.message || 'Failed to add favorite');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add favorite');
    }
  }
);

// Async thunk to remove trial favorite
export const removeTrialFavorite = createAsyncThunk(
  'favorites/removeTrialFavorite',
  async ({ userId, trialId }: { userId: string; trialId: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.removeFavoriteTrial(userId, trialId);
      if (response.success) {
        return trialId;
      }
      throw new Error(response.message || 'Failed to remove favorite');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove favorite');
    }
  }
);

// Async thunk to add researcher favorite
export const addResearcherFavorite = createAsyncThunk(
  'favorites/addResearcherFavorite',
  async ({ userId, researcherId }: { userId: string; researcherId: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.addFavoriteResearcher(userId, researcherId);
      if (response.success) {
        return researcherId;
      }
      throw new Error(response.message || 'Failed to add favorite');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add favorite');
    }
  }
);

// Async thunk to remove researcher favorite
export const removeResearcherFavorite = createAsyncThunk(
  'favorites/removeResearcherFavorite',
  async ({ userId, researcherId }: { userId: string; researcherId: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.removeFavoriteResearcher(userId, researcherId);
      if (response.success) {
        return researcherId;
      }
      throw new Error(response.message || 'Failed to remove favorite');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove favorite');
    }
  }
);

// Async thunk to add publication favorite
export const addPublicationFavorite = createAsyncThunk(
  'favorites/addPublicationFavorite',
  async ({ userId, publicationId }: { userId: string; publicationId: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.addFavoritePublication(userId, publicationId);
      if (response.success) {
        return publicationId;
      }
      throw new Error(response.message || 'Failed to add favorite');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add favorite');
    }
  }
);

// Async thunk to remove publication favorite
export const removePublicationFavorite = createAsyncThunk(
  'favorites/removePublicationFavorite',
  async ({ userId, publicationId }: { userId: string; publicationId: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.removeFavoritePublication(userId, publicationId);
      if (response.success) {
        return publicationId;
      }
      throw new Error(response.message || 'Failed to remove favorite');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favoriteTrials = [];
      state.favoriteResearchers = [];
      state.favoritePublications = [];
      state.lastFetched = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteTrials = action.payload.trials;
        state.favoriteResearchers = action.payload.researchers;
        state.favoritePublications = action.payload.publications;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add trial favorite
      .addCase(addTrialFavorite.fulfilled, (state, action) => {
        if (!state.favoriteTrials.includes(action.payload)) {
          state.favoriteTrials.push(action.payload);
        }
        state.error = null;
      })
      .addCase(addTrialFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Remove trial favorite
      .addCase(removeTrialFavorite.fulfilled, (state, action) => {
        state.favoriteTrials = state.favoriteTrials.filter(id => id !== action.payload);
        state.error = null;
      })
      .addCase(removeTrialFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Add researcher favorite
      .addCase(addResearcherFavorite.fulfilled, (state, action) => {
        if (!state.favoriteResearchers.includes(action.payload)) {
          state.favoriteResearchers.push(action.payload);
        }
        state.error = null;
      })
      .addCase(addResearcherFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Remove researcher favorite
      .addCase(removeResearcherFavorite.fulfilled, (state, action) => {
        state.favoriteResearchers = state.favoriteResearchers.filter(id => id !== action.payload);
        state.error = null;
      })
      .addCase(removeResearcherFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Add publication favorite
      .addCase(addPublicationFavorite.fulfilled, (state, action) => {
        if (!state.favoritePublications.includes(action.payload)) {
          state.favoritePublications.push(action.payload);
        }
        state.error = null;
      })
      .addCase(addPublicationFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Remove publication favorite
      .addCase(removePublicationFavorite.fulfilled, (state, action) => {
        state.favoritePublications = state.favoritePublications.filter(id => id !== action.payload);
        state.error = null;
      })
      .addCase(removePublicationFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearFavorites, clearError } = favoritesSlice.actions;

// Selectors
export const selectFavoriteTrials = (state: any) => state.favorites.favoriteTrials;
export const selectFavoriteResearchers = (state: any) => state.favorites.favoriteResearchers;
export const selectFavoritePublications = (state: any) => state.favorites.favoritePublications;
export const selectIsTrialFavorited = (state: any, trialId: string) => state.favorites.favoriteTrials.includes(trialId);
export const selectIsResearcherFavorited = (state: any, researcherId: string) => state.favorites.favoriteResearchers.includes(researcherId);
export const selectIsPublicationFavorited = (state: any, publicationId: string) => state.favorites.favoritePublications.includes(publicationId);
export const selectFavoritesLoading = (state: any) => state.favorites.isLoading;
export const selectFavoritesError = (state: any) => state.favorites.error;

export default favoritesSlice.reducer;