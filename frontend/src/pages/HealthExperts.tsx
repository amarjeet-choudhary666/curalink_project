import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';
import FavoriteButton from '../components/FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';
import apiService from '../services/api';

interface HealthExpert {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  specialties: string[];
  interests: string[];
  availability: boolean;
  orcid?: string;
  researchgate?: string;
}

const HealthExperts: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  const [experts, setExperts] = useState<HealthExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [error, setError] = useState('');
  // Use the new Redux-based favorites system
  const { toggleResearcherFavorite, favoriteResearchers } = useFavorites(user?.id);

  const specialties = [
    'Oncology', 'Neurology', 'Cardiology', 'Immunology', 'Endocrinology',
    'Pulmonology', 'Gastroenterology', 'Dermatology', 'Psychiatry', 'Radiology'
  ];

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const params: any = {
        limit: 50,
        offset: 0,
      };

      if (selectedSpecialty) params.specialty = selectedSpecialty;
      if (locationFilter) params.location = locationFilter;
      if (showAvailableOnly) params.availability = true;
      if (searchTerm) params.search = searchTerm;

      const response = await apiService.listResearchers(params);

      if (response.success && response.data) {
        const data = response.data as { researchers: any[] };
        const researchers = data.researchers.map((researcher: any) => ({
          id: researcher.id,
          userId: researcher.user.id,
          name: researcher.user.name || 'Unknown',
          email: researcher.user.email,
          bio: researcher.user.bio,
          location: researcher.user.location,
          specialties: researcher.specialties || [],
          interests: researcher.interests || [],
          availability: researcher.availability,
          orcid: researcher.orcid,
          researchgate: researcher.researchgate,
        }));
        setExperts(researchers);
      } else {
        setError('Failed to load researchers');
      }
    } catch (err) {
      setError('Failed to load researchers');
      console.error('Error fetching researchers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExperts();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSpecialty, locationFilter, showAvailableOnly]);

  // Since filtering is now done on the backend, we don't need client-side filtering
  const filteredExperts = experts;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Finding health experts for you...</p>
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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error Loading Experts</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError('');
              fetchExperts();
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Health Experts</h1>
              <p className="text-xl text-slate-600">
                Connect with leading healthcare professionals and researchers
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => {
                  console.log('Debug - Favorite researchers:', favoriteResearchers);
                  console.log('Debug - User ID:', user?.id);
                  alert(`Favorite researchers: ${favoriteResearchers.length} items. Check console for details.`);
                }}
                className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
              >
                🔍 Debug Researcher Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Experts
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by name or specialty..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-slate-700">Available only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-slate-600">
            Found {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Experts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <div
              key={expert.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Expert Image/Avatar */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-700">
                    {expert.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-800">{expert.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      On Platform
                    </span>
                  </div>
                  <p className="text-blue-600 font-semibold">{expert.email}</p>
                  <p className="text-sm text-slate-500">{expert.location || 'Location not specified'}</p>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {expert.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                {expert.interests && expert.interests.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Research Interests:</h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.interests.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                <p className="text-sm text-slate-600 mb-6 line-clamp-3">
                  {expert.bio || 'No bio available'}
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  {user && (
                    <div className="w-full">
                      <FavoriteButton
                        type="researcher"
                        itemId={expert.id}
                        onToggle={() => toggleResearcherFavorite(expert.id)}
                        size="md"
                        showLabel={true}
                        className="w-full px-4 py-3 font-semibold rounded-lg"
                      />
                    </div>
                  )}
                  
                  <Link
                    to={`/experts/${expert.userId}`}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-center block"
                  >
                    View Profile
                  </Link>
                  {expert.availability && (
                    <Link
                      to={`/request-meeting/${expert.userId}`}
                      className="w-full px-4 py-3 border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300 text-center block"
                    >
                      Request Meeting
                    </Link>
                  )}
                </div>

                {/* Availability Status */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Availability:</span>
                    <span className={`text-sm font-medium ${
                      expert.availability ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {expert.availability ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No experts found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search criteria or browse all experts
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
                setLocationFilter('');
                setShowAvailableOnly(false);
              }}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Need Help Finding the Right Expert?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-slate-800 mb-2">AI Matching</h3>
              <p className="text-sm text-slate-600">
                Our AI analyzes your profile to suggest the most relevant experts
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-semibold text-slate-800 mb-2">Personal Support</h3>
              <p className="text-sm text-slate-600">
                Contact our team for personalized expert recommendations
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-slate-800 mb-2">Global Network</h3>
              <p className="text-sm text-slate-600">
                Access experts worldwide, with options for remote consultations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthExperts;