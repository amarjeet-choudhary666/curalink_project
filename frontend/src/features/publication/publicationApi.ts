import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const publicationApi = createApi({
  reducerPath: 'publicationApi',
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
    searchPublications: builder.query({
      query: (params: {
        q?: string;
        journal?: string;
        type?: string;
        year?: number;
        limit?: number;
        offset?: number;
      }) => ({
        url: '/publications/search',
        params,
      }),
    }),
    listPublications: builder.query({
      query: (params: { limit?: number; offset?: number } = {}) => ({
        url: '/publications',
        params,
      }),
    }),
    getPublicationById: builder.query({
      query: (id: string) => `/publications/${id}`,
    }),
  }),
});

export const {
  useSearchPublicationsQuery,
  useListPublicationsQuery,
  useGetPublicationByIdQuery,
} = publicationApi;