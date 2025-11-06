import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const clinicalTrialApi = createApi({
  reducerPath: 'clinicalTrialApi',
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
    searchClinicalTrials: builder.query({
      query: (params: {
        q?: string;
        phase?: string;
        status?: string;
        location?: string;
        limit?: number;
        offset?: number;
      }) => ({
        url: '/clinical-trials/search',
        params,
      }),
    }),
    listClinicalTrials: builder.query({
      query: (params: { limit?: number; offset?: number } = {}) => ({
        url: '/clinical-trials',
        params,
      }),
    }),
    getClinicalTrialById: builder.query({
      query: (id: string) => `/clinical-trials/${id}`,
    }),
  }),
});

export const {
  useSearchClinicalTrialsQuery,
  useListClinicalTrialsQuery,
  useGetClinicalTrialByIdQuery,
} = clinicalTrialApi;