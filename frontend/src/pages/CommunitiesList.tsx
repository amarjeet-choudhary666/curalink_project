import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useListCommunitiesQuery } from '../features/community/communityApi';
import LoadingSpinner from '../components/LoadingSpinner';
import type { RootState } from '../store';


const CommunitiesList = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
  });

  // Fetch communities using RTK Query
  const {
    data: communitiesData,
    isLoading,
    error,
    refetch,
  } = useListCommunitiesQuery({
    limit: pagination.limit,
    offset: pagination.offset,
  });

  const communities = communitiesData?.communities || [];
  const totalCommunities = communitiesData?.total || 0;

  const handlePageChange = (newOffset: number) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading communities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load communities</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto container-responsive">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-responsive-2xl">Communities</h1>
            <p className="text-gray-600">Join discussions and connect with others in the medical research community.</p>
          </div>
          
          {user && (user.role === 'RESEARCHER' || user.role === 'PATIENT') && (
            <div className="mt-4 sm:mt-0">
              <Link
                to="/communities/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">💬</span>
                Create Community
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community: any) => (
          <div key={community.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                <Link
                  to={`/community/${community.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {community.title}
                </Link>
              </h2>
              {community.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">{community.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Created {new Date(community.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/community/${community.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Posts →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No communities found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalCommunities > pagination.limit && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
            disabled={pagination.offset === 0 || isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(totalCommunities / pagination.limit)}
          </span>

          <button
            onClick={() => handlePageChange(pagination.offset + pagination.limit)}
            disabled={pagination.offset + pagination.limit >= totalCommunities || isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunitiesList;