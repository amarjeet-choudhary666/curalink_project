import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';

interface Researcher {
  id: string;
  name: string;
  email: string;
  researcher?: {
    specialties: string[];
    availability: boolean;
  };
}

const RequestMeeting: React.FC = () => {
  const { researcherId } = useParams<{ researcherId: string }>();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;
  const [researcher, setResearcher] = useState<Researcher | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    scheduledFor: '',
  });
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (researcherId) {
      fetchResearcher();
    }
  }, [researcherId]);

  const fetchResearcher = async () => {
    try {
      const response = await apiService.getUserById(researcherId!);
      if (response.success && response.data) {
        setResearcher(response.data as Researcher);
      } else {
        setError('Researcher not found');
      }
    } catch (err) {
      setError('Failed to load researcher information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researcherId) return;

    setSubmitting(true);
    setError('');

    try {
      const requestData = {
        recipientId: researcherId,
        message: formData.message || undefined,
        scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor).toISOString() : undefined,
      };

      const response = await apiService.createMeetingRequest(requestData);
      if (response.success) {
        navigate('/dashboard', { state: { message: 'Meeting request sent successfully!' } });
      } else {
        setError(response.message || 'Failed to send meeting request');
      }
    } catch (err) {
      setError('Failed to send meeting request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading researcher information...</p>
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
          <p className="text-slate-600 mb-6">Please log in to request a meeting</p>
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

  if (error && !researcher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!researcher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Researcher Not Found</h2>
          <p className="text-slate-600 mb-6">The researcher you're looking for doesn't exist or is no longer available.</p>
          <button
            onClick={() => navigate('/experts')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Experts
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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Request Meeting</h1>
          <p className="text-xl text-slate-600">
            Send a consultation request to this health expert
          </p>
        </div>

        {/* Researcher Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Expert Information</h2>
          
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {researcher.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{researcher.name}</h3>
              <p className="text-slate-600 mb-3">{researcher.email}</p>
              
              {researcher.researcher?.specialties && researcher.researcher.specialties.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {researcher.researcher.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <span className="text-sm font-semibold text-slate-700 mr-3">Availability:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  researcher.researcher?.availability
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {researcher.researcher?.availability ? '✅ Available' : '❌ Not Available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {researcher.researcher && !researcher.researcher.availability && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <span className="text-yellow-500 text-xl mr-3">⚠️</span>
              <p className="text-yellow-800">
                This expert is currently not available for meetings. You can still send a request, but it may not be accepted immediately.
              </p>
            </div>
          </div>
        )}

        {/* Meeting Request Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Meeting Request Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                💬 Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell the expert why you'd like to meet and what you'd like to discuss. For example: your condition, specific questions, or research interests..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <p className="mt-2 text-sm text-slate-500">
                A detailed message increases your chances of getting a positive response.
              </p>
            </div>

            <div>
              <label htmlFor="scheduledFor" className="block text-sm font-medium text-slate-700 mb-2">
                🕒 Preferred Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="scheduledFor"
                name="scheduledFor"
                value={formData.scheduledFor}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <p className="mt-2 text-sm text-slate-500">
                Suggest a preferred time, but the expert may propose an alternative.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-3">⚠️</span>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Request...
                  </div>
                ) : (
                  '📤 Send Meeting Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestMeeting;