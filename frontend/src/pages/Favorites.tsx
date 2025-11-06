import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';

interface FavoriteItem {
  id: string;
  type: 'trial' | 'publication' | 'researcher';
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  createdAt: string;
}

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated, user, navigate]);

  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError('');
      
      const response = await apiService.getUserFavorites(user.id);
      
      if (response.success && response.data) {
        const allFavorites: FavoriteItem[] = [];

        // Process favorite trials
        if (response.data.trials) {
          response.data.trials.forEach((fav: any) => {
            allFavorites.push({
              id: fav.id,
              type: 'trial',
              title: fav.trial?.title || 'Clinical Trial',
              subtitle: `Phase ${fav.trial?.phase || 'Unknown'}`,
              description: fav.trial?.summary,
              url: `/clinical-trials/${fav.trial?.id}`,
              createdAt: fav.createdAt,
            });
          });
        }

        // Process favorite publications
        if (response.data.publications) {
          response.data.publications.forEach((fav: any) => {
            allFavorites.push({
              id: fav.id,
              type: 'publication',
              title: fav.publication?.title || 'Publication',
              subtitle: fav.publication?.journal,
              description: fav.publication?.abstract,
              url: `/publications/${fav.publication?.id}`,
              createdAt: fav.createdAt,
            });
          });
        }

        // Process favorite researchers
        if (response.data.researchers) {
          response.data.researchers.forEach((fav: any) => {
            allFavorites.push({
              id: fav.id,
              type: 'researcher',
              title: fav.researcher?.user?.name || 'Researcher',
              subtitle: fav.researcher?.user?.email,
              description: fav.researcher?.user?.bio,
              url: `/experts/${fav.researcher?.userId}`,
              createdAt: fav.createdAt,
            });
          });
        }

        // Sort by creation date (newest first)
        allFavorites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setFavorites(allFavorites);
      } else {
        setError('Failed to load favorites');
      }
    } catch (err) {
      setError('Failed to load favorites');
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFavorites = favorites.filter(fav => 
    filter === 'all' || fav.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trial': return '🧪';
      case 'publication': return '📚';
      case 'researcher': return '👨‍⚕️';
      default: return '⭐';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trial': return 'Clinical Trial';
      case 'publication': return 'Publication';
      case 'researcher': return 'Researcher';
      default: return 'Item';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trial': return 'bg-green-100 text-green-800';
      case 'publication': return 'bg-blue-100 text-blue-800';
      case 'researcher': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading your favorites...</p>
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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error Loading Favorites</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError('');
              fetchFavorites();
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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Favorites</h1>
          <p className="text-xl text-slate-600">
            Your saved clinical trials, publications, and researchers
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Favorites', count: favorites.length },
              { key: 'trial', label: 'Clinical Trials', count: favorites.filter(f => f.type === 'trial').length },
              { key: 'publication', label: 'Publications', count: favorites.filter(f => f.type === 'publication').length },
              { key: 'researcher', label: 'Researchers', count: favorites.filter(f => f.type === 'researcher').length },
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

        {/* Favorites List */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {filter === 'all' ? 'No Favorites Yet' : `No ${getTypeLabel(filter)}s Favorited`}
            </h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all' 
                ? 'Start exploring and save items you\'re interested in!'
                : `You haven't favorited any ${filter}s yet. Start exploring to find interesting content!`
              }
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/clinical-trials"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                <span className="mr-2">🧪</span>
                Browse Clinical Trials
              </Link>
              <Link
                to="/experts"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <span className="mr-2">👨‍⚕️</span>
                Find Health Experts
              </Link>
              <Link
                to="/publications"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
              >
                <span className="mr-2">📚</span>
                Browse Publications
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getTypeIcon(favorite.type)}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(favorite.type)}`}>
                        {getTypeLabel(favorite.type)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {favorite.url ? (
                        <Link 
                          to={favorite.url}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {favorite.title}
                        </Link>
                      ) : (
                        favorite.title
                      )}
                    </h3>
                    
                    {favorite.subtitle && (
                      <p className="text-blue-600 font-semibold mb-2">{favorite.subtitle}</p>
                    )}
                    
                    {favorite.description && (
                      <p className="text-slate-600 mb-3 line-clamp-2">{favorite.description}</p>
                    )}
                    
                    <p className="text-sm text-slate-500">
                      Added on {new Date(favorite.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  
                  <div className="ml-6">
                    {favorite.url && (
                      <Link
                        to={favorite.url}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Discover More</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-slate-800 mb-2">Explore Trials</h3>
              <p className="text-sm text-slate-600 mb-4">
                Find clinical trials that match your condition and interests
              </p>
              <Link
                to="/clinical-trials"
                className="inline-block px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                Browse Trials
              </Link>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">👨‍⚕️</div>
              <h3 className="font-semibold text-slate-800 mb-2">Find Experts</h3>
              <p className="text-sm text-slate-600 mb-4">
                Connect with leading healthcare professionals and researchers
              </p>
              <Link
                to="/experts"
                className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Find Experts
              </Link>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-slate-800 mb-2">Read Research</h3>
              <p className="text-sm text-slate-600 mb-4">
                Stay updated with the latest medical research and publications
              </p>
              <Link
                to="/publications"
                className="inline-block px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors"
              >
                Browse Publications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;