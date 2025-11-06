import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';

interface MeetingRequest {
  id: string;
  message?: string;
  scheduledFor?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  recipient: {
    id: string;
    name: string;
    email: string;
  };
}

const ManageMeetingRequests: React.FC = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchMeetingRequests();
    }
  }, [user?.id, filter]);

  const fetchMeetingRequests = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.listUserMeetingRequests(user.id, {
        status: filter || undefined,
        limit: 50,
      });

      if (response.success && response.data) {
        setRequests((response.data as any)?.meetingRequests || []);
      } else {
        setError(response.message || 'Failed to load meeting requests');
      }
    } catch (err) {
      setError('Failed to load meeting requests');
      console.error('Error fetching meeting requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const response = await apiService.acceptMeetingRequest(requestId);
      if (response.success) {
        // Update the request status in the local state
        setRequests(prev =>
          prev.map(req =>
            req.id === requestId ? { ...req, status: 'ACCEPTED' } : req
          )
        );
      } else {
        setError(response.message || 'Failed to accept meeting request');
      }
    } catch (err) {
      setError('Failed to accept meeting request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await apiService.rejectMeetingRequest(requestId);
      if (response.success) {
        // Update the request status in the local state
        setRequests(prev =>
          prev.map(req =>
            req.id === requestId ? { ...req, status: 'REJECTED' } : req
          )
        );
      } else {
        setError(response.message || 'Failed to reject meeting request');
      }
    } catch (err) {
      setError('Failed to reject meeting request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading meeting requests...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Authentication Required</h2>
          <p className="text-slate-600 mb-6">Please log in to manage your meeting requests</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Meeting Requests</h1>
          <p className="text-xl text-slate-600">
            Manage consultation requests from patients
          </p>
        </div>

        {/* Filter and Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Requests</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <button
              onClick={fetchMeetingRequests}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Requests List */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No meeting requests</h3>
              <p className="text-slate-600">
                {filter ? 'No requests match your current filter.' : 'You haven\'t received any meeting requests yet.'}
              </p>
              {filter && (
                <button
                  onClick={() => setFilter('')}
                  className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {request.sender.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {request.sender.name}
                        </h3>
                        <p className="text-slate-600">{request.sender.email}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      📅 Requested on: {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                {request.message && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2">💬 Message:</h4>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 leading-relaxed">{request.message}</p>
                    </div>
                  </div>
                )}

                {request.scheduledFor && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2">🕒 Preferred Time:</h4>
                    <p className="text-slate-700 bg-blue-50 p-3 rounded-lg">
                      {formatDate(request.scheduledFor)}
                    </p>
                  </div>
                )}

                {request.status === 'PENDING' && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      ✅ Accept Request
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      ❌ Reject Request
                    </button>
                  </div>
                )}

                {request.status === 'ACCEPTED' && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center text-green-600">
                      <span className="text-xl mr-2">✅</span>
                      <span className="font-medium">Meeting request accepted</span>
                    </div>
                  </div>
                )}

                {request.status === 'REJECTED' && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center text-red-600">
                      <span className="text-xl mr-2">❌</span>
                      <span className="font-medium">Meeting request rejected</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMeetingRequests;