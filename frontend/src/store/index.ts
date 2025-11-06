import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import { userApi } from '../features/user/userApi';
import { patientProfileApi } from '../features/patientProfile/patientProfileApi';
import { researcherProfileApi } from '../features/researcherProfile/researcherProfileApi';
import { clinicalTrialApi } from '../features/clinicalTrial/clinicalTrialApi';
import { publicationApi } from '../features/publication/publicationApi';
import { favoritesApi } from '../features/favorites/favoritesApi';
import { communityApi } from '../features/community/communityApi';
import { postApi } from '../features/post/postApi';
import { replyApi } from '../features/reply/replyApi';
import { meetingRequestApi } from '../features/meetingRequest/meetingRequestApi';
import authSlice from '../features/auth/authSlice';
import favoritesSlice from './favoritesSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [patientProfileApi.reducerPath]: patientProfileApi.reducer,
    [researcherProfileApi.reducerPath]: researcherProfileApi.reducer,
    [clinicalTrialApi.reducerPath]: clinicalTrialApi.reducer,
    [publicationApi.reducerPath]: publicationApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [communityApi.reducerPath]: communityApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [replyApi.reducerPath]: replyApi.reducer,
    [meetingRequestApi.reducerPath]: meetingRequestApi.reducer,
    auth: authSlice,
    favorites: favoritesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      patientProfileApi.middleware,
      researcherProfileApi.middleware,
      clinicalTrialApi.middleware,
      publicationApi.middleware,
      favoritesApi.middleware,
      communityApi.middleware,
      postApi.middleware,
      replyApi.middleware,
      meetingRequestApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;