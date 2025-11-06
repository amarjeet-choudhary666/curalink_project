import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';
import FavoriteButton from '../components/FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';

interface ClinicalTrial {
  id: string;
  title: string;
  summary?: string;
  phase: string;
  status: string;
  locations: string[];
  contactEmail?: string;
  startDate?: string;
  endDate?: string;
  tags: string[];
}

const ClinicalTrialsList: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');

  const phases = ['PHASE_0', 'PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'N_A'];
  const statuses = ['RECRUITING', 'ACTIVE_NOT_RECRUITING', 'COMPLETED', 'TERMINATED'];

  useEffect(() => {
    fetchTrials();
  }, [searchTerm, selectedPhase, selectedStatus]);

  const fetchTrials = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params: any = { limit: 20 };
      if (searchTerm) params.q = searchTerm;
      if (selectedPhase) params.phase = selectedPhase;
      if (selectedStatus) params.status = selectedStatus;

      const result = await apiService.searchClinicalTrials(params);
      
      if (result.success) {
        // Handle different possible response structures
        const trialsData = result.data;
        if (Array.isArray(trialsData)) {
          setTrials(trialsData);
        } else if (trialsData && typeof trialsData === 'object' && 'trials' in trialsData && Array.isArray((trialsData as any).trials)) {
          setTrials((trialsData as any).trials);
        } else if (trialsData && typeof trialsData === 'object' && 'data' in trialsData && Array.isArray((trialsData as any).data)) {
          setTrials((trialsData as any).data);
        } else {
          setTrials([]);
        }
      } else {
        setError(result.message || 'Failed to fetch trials');
        setTrials([]);
      }
    } catch (err) {
      setError('Failed to fetch clinical trials');
      setTrials([]); // Ensure trials is always an array
      console.error('Error fetching trials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Use the new Redux-based favorites system
  const { toggleTrialFavorite, favoriteTrials } = useFavorites(user?.id);
  
  // Debug: Log favorites state
  React.useEffect(() => {
    console.log('ClinicalTrialsList - Current favorite trials:', favoriteTrials);
  }, [favoriteTrials]);





  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'PHASE_0': return 'Phase 0';
      case 'PHASE_1': return 'Phase I';
      case 'PHASE_2': return 'Phase II';
      case 'PHASE_3': return 'Phase III';
      case 'PHASE_4': return 'Phase IV';
      case 'N_A': return 'N/A';
      default: return phase;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'RECRUITING': return 'Recruiting';
      case 'ACTIVE_NOT_RECRUITING': return 'Active, not recruiting';
      case 'COMPLETED': return 'Completed';
      case 'TERMINATED': return 'Terminated';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECRUITING': return 'bg-green-100 text-green-800';
      case 'ACTIVE_NOT_RECRUITING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'TERMINATED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Clinical Trials</h1>
              <p className="text-xl text-slate-600">
                Discover clinical trials that match your condition and interests
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2">
              {user?.role === 'RESEARCHER' && (
                <Link
                  to="/clinical-trials/add"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">➕</span>
                  Add Clinical Trial
                </Link>
              )}
              
              <button
                onClick={() => {
                  console.log('Debug - Favorite trials:', favoriteTrials);
                  console.log('Debug - User ID:', user?.id);
                  alert(`Favorite trials: ${favoriteTrials.length} items. Check console for details.`);
                }}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔍 Debug Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Trials
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by condition, treatment, or keywords..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phase
              </label>
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Phases</option>
                {phases.map(phase => (
                  <option key={phase} value={phase}>{getPhaseLabel(phase)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{getStatusLabel(status)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-slate-600">Loading clinical trials...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️ {error}</div>
            <button
              onClick={fetchTrials}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-600">
                Found {Array.isArray(trials) ? trials.length : 0} clinical trial{(Array.isArray(trials) ? trials.length : 0) !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-6">
              {Array.isArray(trials) && trials.map((trial) => (
                <div
                  key={trial.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        <Link
                          to={`/clinical-trials/${trial.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {trial.title}
                        </Link>
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trial.status)}`}>
                          {getStatusLabel(trial.status)}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {getPhaseLabel(trial.phase)}
                        </span>
                      </div>
                    </div>

                    <FavoriteButton
                      type="trial"
                      itemId={trial.id}
                      onToggle={() => toggleTrialFavorite(trial.id)}
                      size="md"
                    />
                  </div>

                  {trial.summary && (
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {trial.summary}
                    </p>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {trial.locations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">Locations</h4>
                        <p className="text-sm text-slate-600">
                          {trial.locations.slice(0, 3).join(', ')}
                          {trial.locations.length > 3 && ` +${trial.locations.length - 3} more`}
                        </p>
                      </div>
                    )}

                    {trial.tags && trial.tags.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {trial.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <div className="flex space-x-4">
                      <Link
                        to={`/clinical-trials/${trial.id}`}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </Link>
                      
                      {trial.contactEmail && (
                        <a
                          href={`mailto:${trial.contactEmail}`}
                          className="px-4 py-2 border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                        >
                          Contact
                        </a>
                      )}
                    </div>

                    {trial.startDate && (
                      <div className="text-sm text-slate-500">
                        Started: {new Date(trial.startDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(!Array.isArray(trials) || trials.length === 0) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No trials found</h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your search criteria or browse all trials
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPhase('');
                    setSelectedStatus('');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClinicalTrialsList;
