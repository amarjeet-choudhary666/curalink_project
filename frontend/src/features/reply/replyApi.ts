import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://curalink-project-1.onrender.com/api';

export const replyApi = createApi({
  reducerPath: 'replyApi',
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
    listRepliesByPost: builder.query({
      query: ({ postId, ...params }: {
        postId: string;
        limit?: number;
        offset?: number;
      }) => ({
        url: `/replies/post/${postId}`,
        params,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
    getReplyById: builder.query({
      query: (id: string) => `/replies/${id}`,
      transformResponse: (response: any) => response.data || response,
    }),
    createReply: builder.mutation({
      query: (replyData: {
        postId: string;
        body: string;
      }) => ({
        url: '/replies',
        method: 'POST',
        body: replyData,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
    updateReply: builder.mutation({
      query: ({ id, ...replyData }: {
        id: string;
        body?: string;
      }) => ({
        url: `/replies/${id}`,
        method: 'PUT',
        body: replyData,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
  }),
});

export const {
  useListRepliesByPostQuery,
  useGetReplyByIdQuery,
  useCreateReplyMutation,
  useUpdateReplyMutation,
} = replyApi;