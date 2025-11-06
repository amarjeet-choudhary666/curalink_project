
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiService } from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';

interface ClinicalTrial {
  id: string;
  title: string;
  summary: string;
  eligibility: string;
  phase: string;
  status: string;
  locations: string[];
  contactEmail?: string;
  startDate?: string;
  endDate?: string;
  externalUrl?: string;
  tags: string[];
  createdAt: string;
  owner?: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  favorites: any[];
}

const ClinicalTrialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  const [trial, setTrial] = useState<ClinicalTrial | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the new Redux-based favorites system
  const { toggleTrialFavorite } = useFavorites(user?.id);

  useEffect(() => {
    if (id) {
      fetchTrial();
    }
  }, [id]);

  const fetchTrial = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await apiService.getClinicalTrialById(id);
      if (response.success && response.data) {
        setTrial(response.data as ClinicalTrial);
      }
    } catch (error) {
      console.error('Error fetching trial:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Loading trial details...</div>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Trial not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link to="/clinical-trials" className="text-blue-600 hover:text-blue-800">
          ← Back to Trials
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{trial.title}</h1>
          {user && (
            <FavoriteButton
              type="trial"
              itemId={trial.id}
              onToggle={() => toggleTrialFavorite(trial.id)}
              size="lg"
              showLabel={true}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Trial Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Phase:</span>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  trial.phase === 'PHASE_1' ? 'bg-blue-100 text-blue-800' :
                  trial.phase === 'PHASE_2' ? 'bg-green-100 text-green-800' :
                  trial.phase === 'PHASE_3' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trial.phase.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  trial.status === 'RECRUITING' ? 'bg-green-100 text-green-800' :
                  trial.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trial.status.replace('_', ' ')}
                </span>
              </div>
              {trial.locations.length > 0 && (
                <div>
                  <span className="font-medium">Locations:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {trial.locations.map((location, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {trial.startDate && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Start Date:</span>
                  <span>{new Date(trial.startDate).toLocaleDateString()}</span>
                </div>
              )}
              {trial.endDate && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">End Date:</span>
                  <span>{new Date(trial.endDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contact & Links</h2>
            <div className="space-y-3">
              {trial.contactEmail && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Contact:</span>
                  <a href={`mailto:${trial.contactEmail}`} className="text-blue-600 hover:text-blue-800">
                    {trial.contactEmail}
                  </a>
                </div>
              )}
              {trial.externalUrl && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">External Link:</span>
                  <a href={trial.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View on ClinicalTrials.gov →
                  </a>
                </div>
              )}
              {trial.owner && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Posted by:</span>
                  <span>{trial.owner.user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {trial.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {trial.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{trial.summary}</p>
        </div>

        {trial.eligibility && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm">{trial.eligibility}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalTrialDetail;