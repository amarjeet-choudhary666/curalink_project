import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetCommunityBySlugQuery } from '../features/community/communityApi';
import { useListPostsByCommunityQuery } from '../features/post/postApi';
import LoadingSpinner from '../components/LoadingSpinner';
import type { RootState } from '../store';

interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name?: string;
    email: string;
  };
  replies: Array<{
    id: string;
    body: string;
    createdAt: string;
    author: {
      id: string;
      name?: string;
      email: string;
    };
  }>;
}



const CommunityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
  });

  // Get user role from auth state
  const authState = useSelector((state: RootState) => state.auth as any);
  const userRole = authState.user?.role?.toLowerCase() || 'patient';

  // Fetch community data
  const {
    data: community,
    isLoading: communityLoading,
    error: communityError,
  } = useGetCommunityBySlugQuery(slug || '', {
    skip: !slug,
  });

  // Fetch posts data
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useListPostsByCommunityQuery(
    {
      communitySlug: slug || '',
      limit: pagination.limit,
      offset: pagination.offset,
    },
    {
      skip: !slug,
    }
  );

  const posts = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;

  // Show loading spinner while community is loading
  if (communityLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading community...</p>
        </div>
      </div>
    );
  }

  // Show error if community failed to load
  if (communityError || !community) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          {communityError ? 'Failed to load community' : 'Community not found'}
        </p>
        <Link
          to="/community"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Communities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto container-responsive">
      {/* Community Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-responsive-2xl">{community.title}</h1>
            {community.description && (
              <p className="text-gray-600 mt-2">{community.description}</p>
            )}
          </div>
          <Link
            to="/community"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Communities
          </Link>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Posts</h2>
          {authState.isAuthenticated && (userRole === 'patient' || userRole === 'researcher') ? (
            <Link
              to={`/community/${community.slug}/create-post`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Post
            </Link>
          ) : !authState.isAuthenticated ? (
            <Link
              to="/login"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Login to Post
            </Link>
          ) : null}
        </div>

        {/* Show loading spinner while posts are loading */}
        {postsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-slate-600">Loading posts...</p>
            </div>
          </div>
        ) : postsError ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-red-600 text-lg mb-4">Failed to load posts</p>
            <button
              onClick={() => refetchPosts()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">No posts yet.</p>
            <p className="text-gray-400">Be the first to start a discussion!</p>
          </div>
        ) : (
          posts.map((post: Post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link
                        to={`/post/${post.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-3">{post.body}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {post.author.name || post.author.email}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>{post.replies?.length || 0} {(post.replies?.length || 0) === 1 ? 'reply' : 'replies'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to={`/post/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Discussion →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {!postsLoading && totalPosts > pagination.limit && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
              disabled={pagination.offset === 0 || postsLoading}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(totalPosts / pagination.limit)}
            </span>

            <button
              onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
              disabled={pagination.offset + pagination.limit >= totalPosts || postsLoading}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;