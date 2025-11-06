import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://curalink-project-1.onrender.com/api';

export const postApi = createApi({
  reducerPath: 'postApi',
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
    listPosts: builder.query({
      query: (params: { limit?: number; offset?: number } = {}) => ({
        url: '/posts',
        params,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
    listPostsByCommunity: builder.query({
      query: ({ communitySlug, ...params }: {
        communitySlug: string;
        limit?: number;
        offset?: number;
      }) => ({
        url: `/posts/community/${communitySlug}`,
        params,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
    getPostById: builder.query({
      query: (id: string) => `/posts/${id}`,
      transformResponse: (response: any) => response.data || response,
    }),
    createPost: builder.mutation({
      query: (postData: {
        communityId?: string;
        title: string;
        body: string;
      }) => ({
        url: '/posts',
        method: 'POST',
        body: postData,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
    updatePost: builder.mutation({
      query: ({ id, ...postData }: {
        id: string;
        title?: string;
        body?: string;
        locked?: boolean;
      }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: postData,
      }),
      transformResponse: (response: any) => response.data || response,
    }),
  }),
});

export const {
  useListPostsQuery,
  useListPostsByCommunityQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
} = postApi;