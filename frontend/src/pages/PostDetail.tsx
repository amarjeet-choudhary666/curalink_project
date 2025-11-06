import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetPostByIdQuery } from '../features/post/postApi';
import { useCreateReplyMutation } from '../features/reply/replyApi';
import LoadingSpinner from '../components/LoadingSpinner';
import type { RootState } from '../store';

interface Reply {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
  community: {
    id: string;
    slug: string;
    title: string;
  };
  replies: Reply[];
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState('');

  // Get user role from auth state
  const authState = useSelector((state: RootState) => state.auth as any);
  const userRole = authState.user?.role?.toLowerCase() || '';
  const isAuthenticated = authState.isAuthenticated;

  // RTK Query hooks
  const {
    data: post,
    isLoading: loading,
    error,
    refetch: refetchPost,
  } = useGetPostByIdQuery(id || '', {
    skip: !id,
  });

  const [createReply, { isLoading: submittingReply }] = useCreateReplyMutation();

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !replyBody.trim()) return;

    try {
      const result = await createReply({
        postId: post.id,
        body: replyBody.trim(),
      }).unwrap();

      if (result) {
        setReplyBody('');
        setShowReplyForm(false);
        // Refresh post to show new reply
        refetchPost();
      }
    } catch (err: any) {
      console.error('Error creating reply:', err);
      alert(err.data?.message || err.message || 'An error occurred while creating reply');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || 'Post not found'}</p>
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
    <div className="max-w-4xl mx-auto container-responsive">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to={`/community/${post.community.slug}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {post.community.title}
        </Link>
        <span className="text-gray-500 mx-2">›</span>
        <span className="text-gray-700">{post.title}</span>
      </div>

      {/* Post Content */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-responsive-xl">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>By {post.author.name || post.author.email}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              post.author.role === 'RESEARCHER'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {post.author.role.toLowerCase()}
            </span>
          </div>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{post.body}</p>
        </div>
      </div>

      {/* Replies Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Replies ({post.replies.length})
            </h2>
            {isAuthenticated && (userRole === 'researcher' || userRole === 'patient') ? (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {showReplyForm ? 'Cancel' : 'Reply'}
              </button>
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Login to Reply
              </Link>
            ) : null}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleReplySubmit}>
              <div className="mb-4">
                <label htmlFor="replyBody" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  id="replyBody"
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply || !replyBody.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Replies List */}
        <div className="divide-y divide-gray-200">
          {post.replies.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No replies yet. Be the first to reply!</p>
            </div>
          ) : (
            post.replies.map((reply) => (
              <div key={reply.id} className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {reply.author.name || reply.author.email}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        reply.author.role === 'RESEARCHER'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {reply.author.role.toLowerCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.body}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;