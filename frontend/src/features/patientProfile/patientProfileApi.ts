import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const patientProfileApi = createApi({
  reducerPath: 'patientProfileApi',
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
    getPatientProfile: builder.query({
      query: (userId: string) => `/patient-profiles/${userId}`,
    }),
    updatePatientProfile: builder.mutation({
      query: ({ userId, ...profileData }: {
        userId: string;
        conditions?: string[];
        about?: string;
        preferRemote?: boolean;
        preferences?: any;
      }) => ({
        url: `/patient-profiles/${userId}`,
        method: 'PUT',
        body: profileData,
      }),
    }),
  }),
});

export const { useGetPatientProfileQuery, useUpdatePatientProfileMutation } = patientProfileApi;