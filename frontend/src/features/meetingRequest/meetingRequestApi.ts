import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://curalink-project-1.onrender.com/api';

export const meetingRequestApi = createApi({
  reducerPath: 'meetingRequestApi',
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
    createMeetingRequest: builder.mutation({
      query: (requestData: {
        recipientId: string;
        message?: string;
        scheduledFor?: string;
      }) => ({
        url: '/meeting-requests',
        method: 'POST',
        body: requestData,
      }),
    }),
    updateMeetingRequest: builder.mutation({
      query: ({ id, ...requestData }: {
        id: string;
        message?: string;
        scheduledFor?: string;
        status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
      }) => ({
        url: `/meeting-requests/${id}`,
        method: 'PUT',
        body: requestData,
      }),
    }),
    getMeetingRequestById: builder.query({
      query: (id: string) => `/meeting-requests/${id}`,
    }),
    listUserMeetingRequests: builder.query({
      query: ({ userId, ...params }: {
        userId: string;
        status?: string;
        limit?: number;
        offset?: number;
      }) => ({
        url: `/meeting-requests/user/${userId}`,
        params,
      }),
    }),
    acceptMeetingRequest: builder.mutation({
      query: (id: string) => ({
        url: `/meeting-requests/${id}/accept`,
        method: 'PUT',
      }),
    }),
    rejectMeetingRequest: builder.mutation({
      query: (id: string) => ({
        url: `/meeting-requests/${id}/reject`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useCreateMeetingRequestMutation,
  useUpdateMeetingRequestMutation,
  useGetMeetingRequestByIdQuery,
  useListUserMeetingRequestsQuery,
  useAcceptMeetingRequestMutation,
  useRejectMeetingRequestMutation,
} = meetingRequestApi;