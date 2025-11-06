import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../store';
import type { MeetingRequest } from '../types/api';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';

interface MeetingRequestsResponse {
  meetingRequests: MeetingRequest[];
  total: number;
  limit: number;
  offset: number;
}

const MyMeetingRequests: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    console.log('MyMeetingRequests - Auth state:', { isAuthenticated, user: user?.id, token: localStorage.getItem('accessToken') });
    if (isAuthenticated && user?.id) {
      fetchMeetingRequests();
    } else {
      console.log('Not fetching requests - not authenticated or no user ID');
    }
  }, [isAuthenticated, user, filter]);

  const fetchMeetingRequests = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const params: any = { limit: 50 };
      if (filter !== 'all') {
        params.status = filter.toUpperCase();
      }

      console.log('Fetching meeting requests for user:', user.id, 'with params:', params);
      console.log('Token exists:', !!localStorage.getItem('accessToken'));
      
      const response = await apiService.listUserMeetingRequests(user.id, params);
      console.log('API response:', response);
      
      if (response.success && response.data) {
        const data = response.data as MeetingRequestsResponse;
        setMeetingRequests(data.meetingRequests || []);
      } else {
        setError(response.message || 'Failed to load meeting requests');
      }
    } catch (err: any) {
      console.error('Error fetching meeting requests:', err);
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to load meeting requests: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      case 'cancelled': return '🚫';
      default: return '❓';
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

  const sentRequests = meetingRequests.filter(req => req.sender.id === user?.id);
  const receivedRequests = meetingRequests.filter(req => req.recipient.id === user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading your meeting requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error Loading Requests</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError('');
              fetchMeetingRequests();
            }}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Meeting Requests</h1>
          <p className="text-xl text-slate-600">
            Manage your consultation requests with health experts
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Requests', count: meetingRequests.length },
              { key: 'pending', label: 'Pending', count: meetingRequests.filter(r => r.status === 'PENDING').length },
              { key: 'accepted', label: 'Accepted', count: meetingRequests.filter(r => r.status === 'ACCEPTED').length },
              { key: 'rejected', label: 'Rejected', count: meetingRequests.filter(r => r.status === 'REJECTED').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === tab.key
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Sent Requests Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Requests I Sent</h2>
          
          {sentRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Sent Requests</h3>
              <p className="text-slate-600 mb-6">
                You haven't sent any meeting requests yet. Find health experts to connect with.
              </p>
              <Link
                to="/experts"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <span className="mr-2">👨‍⚕️</span>
                Find Health Experts
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sentRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-slate-800 mr-3">
                          Meeting with {request.recipient.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)} {request.status}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 mb-2">{request.recipient.email}</p>
                      
                      {request.message && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-slate-700 mb-1">Message:</p>
                          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                            {request.message}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>📅 Requested: {formatDate(request.createdAt)}</span>
                        {request.scheduledFor && (
                          <span>🕒 Preferred: {formatDate(request.scheduledFor)}</span>
                        )}
                        {request.updatedAt !== request.createdAt && (
                          <span>🔄 Updated: {formatDate(request.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      {request.status === 'ACCEPTED' && (
                        <div className="text-center">
                          <div className="text-green-600 font-semibold mb-2">✅ Meeting Approved!</div>
                          <p className="text-sm text-slate-600">
                            The expert will contact you soon with meeting details.
                          </p>
                        </div>
                      )}
                      {request.status === 'PENDING' && (
                        <div className="text-center">
                          <div className="text-yellow-600 font-semibold mb-2">⏳ Awaiting Response</div>
                          <p className="text-sm text-slate-600">
                            Your request is being reviewed.
                          </p>
                        </div>
                      )}
                      {request.status === 'REJECTED' && (
                        <div className="text-center">
                          <div className="text-red-600 font-semibold mb-2">❌ Request Declined</div>
                          <p className="text-sm text-slate-600">
                            You can try contacting other experts.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Received Requests Section (for researchers who are also patients) */}
        {user?.role === 'RESEARCHER' && receivedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Requests I Received</h2>
            
            <div className="space-y-4">
              {receivedRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-slate-800 mr-3">
                          Meeting request from {request.sender.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)} {request.status}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 mb-2">{request.sender.email}</p>
                      
                      {request.message && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-slate-700 mb-1">Message:</p>
                          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                            {request.message}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>📅 Received: {formatDate(request.createdAt)}</span>
                        {request.scheduledFor && (
                          <span>🕒 Preferred: {formatDate(request.scheduledFor)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <Link
                        to="/manage-meeting-requests"
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Manage Request
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Meeting Request Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold text-slate-800 mb-2">Be Specific</h3>
              <p className="text-sm text-slate-600">
                Include details about your condition and what you'd like to discuss
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-semibold text-slate-800 mb-2">Be Flexible</h3>
              <p className="text-sm text-slate-600">
                Suggest preferred times but be open to the expert's availability
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-slate-800 mb-2">Be Patient</h3>
              <p className="text-sm text-slate-600">
                Experts may take time to review requests and respond
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMeetingRequests;