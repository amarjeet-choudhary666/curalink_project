import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/api';

interface Collaborator {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  specialties: string[];
  interests: string[];
  orcid?: string;
  researchgate?: string;
  availability: boolean;
  publicationCount: number;
  connectionStatus: 'none' | 'pending' | 'connected';
}

const Collaborators: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [error, setError] = useState('');

  const specialties = [
    'Oncology', 'Neurology', 'Cardiology', 'Immunology', 'Endocrinology',
    'Pulmonology', 'Gastroenterology', 'Dermatology', 'Psychiatry', 'Radiology'
  ];

  const interests = [
    'Immunotherapy', 'Gene Therapy', 'Clinical AI', 'Drug Discovery',
    'Biomarkers', 'Precision Medicine', 'Stem Cell Research', 'Nanotechnology'
  ];

  useEffect(() => {
    fetchCollaborators();
  }, []);

  // Load connection statuses after collaborators are loaded
  useEffect(() => {
    if (collaborators.length > 0 && user?.id) {
      loadConnectionStatuses();
    }
  }, [collaborators.length, user?.id]);

  const loadConnectionStatusesForCollaborators = async (collaboratorsList: Collaborator[]) => {
    if (!user?.id) return;
    
    try {
      console.log('Loading connection statuses for', collaboratorsList.length, 'collaborators');
      
      const response = await apiService.listUserConnections(user.id);
      if (response.success && response.data) {
        const connections = response.data.connections || [];
        console.log('Loaded connections:', connections);
        
        // Update collaborators with their connection status
        const updatedCollaborators = collaboratorsList.map(collaborator => {
          // Find connection where current user is either requester or target
          const connection = connections.find((conn: any) => 
            (conn.requesterId === user.id && conn.targetId === collaborator.userId) ||
            (conn.targetId === user.id && conn.requesterId === collaborator.userId)
          );
          
          if (connection) {
            // Map database status to UI status
            let connectionStatus: 'none' | 'pending' | 'connected' = 'none';
            switch (connection.status) {
              case 'PENDING':
                connectionStatus = 'pending';
                break;
              case 'CONNECTED':
                connectionStatus = 'connected';
                break;
              case 'REJECTED':
                connectionStatus = 'none'; // Treat rejected as none for UI
                break;
              default:
                connectionStatus = 'none';
            }
            
            return {
              ...collaborator,
              connectionStatus
            };
          }
          
          return collaborator;
        });
        
        setCollaborators(updatedCollaborators);
      }
    } catch (error) {
      console.error('Error loading connection statuses:', error);
    }
  };

  const loadConnectionStatuses = async () => {
    if (collaborators.length > 0) {
      await loadConnectionStatusesForCollaborators(collaborators);
    }
  };

  const fetchCollaborators = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const params: any = {
        limit: 50,
        offset: 0,
      };

      if (selectedSpecialty) params.specialty = selectedSpecialty;
      if (locationFilter) params.location = locationFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await apiService.listResearchers(params);
      
      if (response.success && response.data) {
        const researchers = response.data.researchers
          .filter((researcher: any) => researcher.user.id !== user?.id) // Exclude current user
          .map((researcher: any) => ({
            id: researcher.id,
            userId: researcher.user.id,
            name: researcher.user.name || 'Unknown',
            email: researcher.user.email,
            bio: researcher.user.bio,
            location: researcher.user.location,
            specialties: researcher.specialties || [],
            interests: researcher.interests || [],
            orcid: researcher.orcid,
            researchgate: researcher.researchgate,
            availability: researcher.availability,
            publicationCount: researcher.publications?.length || 0,
            connectionStatus: 'none' as const, // TODO: Get real connection status from API
          }));
        setCollaborators(researchers);
        
        // Load connection statuses immediately after setting collaborators
        if (user?.id && researchers.length > 0) {
          setTimeout(() => {
            loadConnectionStatusesForCollaborators(researchers);
          }, 100); // Small delay to ensure state is updated
        }
      } else {
        setError('Failed to load collaborators');
      }
    } catch (err) {
      setError('Failed to load collaborators');
      console.error('Error fetching collaborators:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCollaborators();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSpecialty, locationFilter]);

  // Since filtering is now done on the backend, we don't need client-side filtering
  const filteredCollaborators = collaborators.filter(collaborator => {
    // Only filter by interest on the frontend since backend doesn't support it yet
    const matchesInterest = !selectedInterest || collaborator.interests.includes(selectedInterest);
    return matchesInterest;
  });

  const handleConnect = async (collaboratorUserId: string) => {
    // Optimistically update UI
    setCollaborators(prev => 
      prev.map(c => 
        c.userId === collaboratorUserId 
          ? { ...c, connectionStatus: 'pending' }
          : c
      )
    );

    try {
      const response = await apiService.createConnectionRequest(collaboratorUserId);
      
      if (response.success) {
        console.log('Connection request sent successfully');
        // Status already updated optimistically
      } else {
        // Handle the case where connection already exists
        const message = response.message?.toLowerCase() || '';
        if (message.includes('already exists') || 
            message.includes('connection request already exists') ||
            message.includes('duplicate')) {
          console.log('Connection request already exists, status remains pending');
          // Keep the pending status since request exists
        } else {
          console.error('Failed to send connection request:', response.message);
          // Revert optimistic update on other errors
          setCollaborators(prev => 
            prev.map(c => 
              c.userId === collaboratorUserId 
                ? { ...c, connectionStatus: 'none' }
                : c
            )
          );
        }
      }
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      
      // Handle specific error cases from the catch block
      const errorMessage = error.message?.toLowerCase() || '';
      if (errorMessage.includes('already exists') || 
          errorMessage.includes('connection request already exists') ||
          errorMessage.includes('duplicate')) {
        console.log('Connection request already exists (from catch), status remains pending');
        // Keep the pending status since request exists
      } else {
        // Revert optimistic update on other errors
        setCollaborators(prev => 
          prev.map(c => 
            c.userId === collaboratorUserId 
              ? { ...c, connectionStatus: 'none' }
              : c
          )
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Finding potential collaborators...</p>
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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error Loading Collaborators</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError('');
              fetchCollaborators();
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
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Find Collaborators</h1>
              <p className="text-xl text-slate-600">
                Connect with researchers and expand your network
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex gap-2">
              <button
                onClick={() => {
                  loadConnectionStatuses();
                }}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                🔄 Refresh Status
              </button>
              
              <button
                onClick={() => {
                  const pendingCount = collaborators.filter(c => c.connectionStatus === 'pending').length;
                  const connectedCount = collaborators.filter(c => c.connectionStatus === 'connected').length;
                  console.log('Connection Status Debug:', {
                    total: collaborators.length,
                    pending: pendingCount,
                    connected: connectedCount,
                    collaborators: collaborators.map(c => ({
                      name: c.name,
                      status: c.connectionStatus
                    }))
                  });
                  alert(`Connections: ${connectedCount} connected, ${pendingCount} pending. Check console for details.`);
                }}
                className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
              >
                🔍 Debug Connections
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Researchers
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Name or institution..."
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
                Research Interest
              </label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Interests</option>
                {interests.map(interest => (
                  <option key={interest} value={interest}>{interest}</option>
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
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-slate-600">
            Found {filteredCollaborators.length} potential collaborator{filteredCollaborators.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Collaborators Grid */}
        <div className="space-y-6">
          {filteredCollaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{collaborator.name}</h3>
                    <p className="text-blue-600 font-semibold mb-1">{collaborator.email}</p>
                    <p className="text-sm text-slate-500">{collaborator.location || 'Location not specified'}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        collaborator.availability 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {collaborator.availability ? '✅ Available' : '❌ Not Available'}
                      </span>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="mt-4">
                    {collaborator.connectionStatus === 'connected' && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border-2 border-green-300">
                        <span className="mr-1">🤝</span>
                        Connected
                      </span>
                    )}
                    {collaborator.connectionStatus === 'pending' && (
                      <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full border-2 border-yellow-300">
                        <span className="mr-1">📤</span>
                        Request Sent
                      </span>
                    )}
                    {collaborator.connectionStatus === 'none' && (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                        <span className="mr-1">👋</span>
                        Not Connected
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Bio</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {collaborator.bio || 'No bio available'}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {collaborator.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Research Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {collaborator.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Publications</h4>
                    <p className="text-sm text-slate-600">
                      {collaborator.publicationCount > 0 
                        ? `${collaborator.publicationCount} publications available`
                        : 'No publications listed'
                      }
                    </p>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-800">{collaborator.publicationCount}</div>
                      <div className="text-sm text-slate-600">Publications</div>
                    </div>

                    {collaborator.connectionStatus === 'none' && (
                      <button
                        onClick={() => handleConnect(collaborator.userId)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                      >
                        Send Connection Request
                      </button>
                    )}

                    {collaborator.connectionStatus === 'pending' && (
                      <button
                        disabled
                        className="w-full px-4 py-3 bg-yellow-100 text-yellow-700 font-semibold rounded-lg cursor-not-allowed border-2 border-yellow-300"
                      >
                        <span className="flex items-center justify-center">
                          <span className="mr-2">📤</span>
                          Request Sent
                        </span>
                      </button>
                    )}

                    {collaborator.connectionStatus === 'connected' && (
                      <div className="space-y-2">
                        <button className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
                          Send Message
                        </button>
                        <Link
                          to={`/collaborators/${collaborator.id}`}
                          className="w-full px-4 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 transition-colors text-center block"
                        >
                          View Profile
                        </Link>
                      </div>
                    )}

                    {/* External Links */}
                    <div className="space-y-2">
                      {collaborator.orcid && (
                        <a
                          href={collaborator.orcid.startsWith('http') ? collaborator.orcid : `https://orcid.org/${collaborator.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors text-center block"
                        >
                          ORCID Profile
                        </a>
                      )}
                      {collaborator.researchgate && (
                        <a
                          href={collaborator.researchgate.startsWith('http') ? collaborator.researchgate : `https://${collaborator.researchgate}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors text-center block"
                        >
                          ResearchGate
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCollaborators.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No collaborators found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search criteria or browse all researchers
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
                setSelectedInterest('');
                setLocationFilter('');
              }}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Networking Tips */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Networking Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold text-slate-800 mb-2">Personalize Requests</h3>
              <p className="text-sm text-slate-600">
                Mention specific research interests or publications when connecting
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-slate-800 mb-2">Be Collaborative</h3>
              <p className="text-sm text-slate-600">
                Suggest mutual benefits and potential collaboration opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-slate-800 mb-2">Share Knowledge</h3>
              <p className="text-sm text-slate-600">
                Engage in forums and share your expertise to build relationships
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborators;