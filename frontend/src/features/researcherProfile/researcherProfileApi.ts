import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const researcherProfileApi = createApi({
  reducerPath: 'researcherProfileApi',
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
    getResearcherProfile: builder.query({
      query: (userId: string) => `/researcher-profiles/${userId}`,
    }),
    updateResearcherProfile: builder.mutation({
      query: ({ userId, ...profileData }: {
        userId: string;
        specialties?: string[];
        interests?: string[];
        orcid?: string;
        researchgate?: string;
        availability?: boolean;
        meta?: any;
      }) => ({
        url: `/researcher-profiles/${userId}`,
        method: 'PUT',
        body: profileData,
      }),
    }),
  }),
});

export const { useGetResearcherProfileQuery, useUpdateResearcherProfileMutation } = researcherProfileApi;