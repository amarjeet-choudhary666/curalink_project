import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://curalink-project-1.onrender.com/api';

export const communityApi = createApi({
  reducerPath: 'communityApi',
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
    listCommunities: builder.query({
      query: (params: { limit?: number; offset?: number } = {}) => ({
        url: '/communities',
        params,
      }),
      transformResponse: (response: any) => {
        // Extract the data field from the API response
        return response.data || response;
      },
    }),
    getCommunityBySlug: builder.query({
      query: (slug: string) => `/communities/${slug}`,
      transformResponse: (response: any) => {
        // Extract the data field from the API response
        return response.data || response;
      },
    }),
    createCommunity: builder.mutation({
      query: (communityData: {
        slug: string;
        title: string;
        description?: string;
      }) => ({
        url: '/communities',
        method: 'POST',
        body: communityData,
      }),
      transformResponse: (response: any) => {
        // Extract the data field from the API response
        return response.data || response;
      },
    }),
    updateCommunity: builder.mutation({
      query: ({ slug, ...communityData }: {
        slug: string;
        title?: string;
        description?: string;
      }) => ({
        url: `/communities/${slug}`,
        method: 'PUT',
        body: communityData,
      }),
      transformResponse: (response: any) => {
        // Extract the data field from the API response
        return response.data || response;
      },
    }),
  }),
});

export const {
  useListCommunitiesQuery,
  useGetCommunityBySlugQuery,
  useCreateCommunityMutation,
  useUpdateCommunityMutation,
} = communityApi;