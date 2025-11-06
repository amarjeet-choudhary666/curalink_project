import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    addFavoriteTrial: builder.mutation({
      query: ({ userId, trialId }: { userId: string; trialId: string }) => ({
        url: '/favorites/trials',
        method: 'POST',
        body: { userId, trialId },
      }),
    }),
    removeFavoriteTrial: builder.mutation({
      query: ({ userId, trialId }: { userId: string; trialId: string }) => ({
        url: `/favorites/trials/${userId}/${trialId}`,
        method: 'DELETE',
      }),
    }),
    getUserFavorites: builder.query({
      query: (userId: string) => `/favorites/user/${userId}`,
    }),
    addFavoritePublication: builder.mutation({
      query: ({ userId, publicationId }: { userId: string; publicationId: string }) => ({
        url: '/favorites/publications',
        method: 'POST',
        body: { userId, publicationId },
      }),
    }),
    removeFavoritePublication: builder.mutation({
      query: ({ userId, publicationId }: { userId: string; publicationId: string }) => ({
        url: `/favorites/publications/${userId}/${publicationId}`,
        method: 'DELETE',
      }),
    }),
    addFavoriteResearcher: builder.mutation({
      query: ({ userId, researcherId }: { userId: string; researcherId: string }) => ({
        url: '/favorites/researchers',
        method: 'POST',
        body: { userId, researcherId },
      }),
    }),
    removeFavoriteResearcher: builder.mutation({
      query: ({ userId, researcherId }: { userId: string; researcherId: string }) => ({
        url: `/favorites/researchers/${userId}/${researcherId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useAddFavoriteTrialMutation,
  useRemoveFavoriteTrialMutation,
  useGetUserFavoritesQuery,
  useAddFavoritePublicationMutation,
  useRemoveFavoritePublicationMutation,
  useAddFavoriteResearcherMutation,
  useRemoveFavoriteResearcherMutation,
} = favoritesApi;