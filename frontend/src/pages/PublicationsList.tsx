import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import FavoriteButton from '../components/FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';
import apiService from '../services/api';

interface Publication {
  id: string;
  title: string;
  abstract?: string;
  authors: string[];
  journal?: string;
  year?: number;
  type: string;
  doi?: string;
  url?: string;
  researcher?: {
    user: {
      name?: string;
    };
  };
  favorites?: any[];
}

const PublicationsList: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    journal: '',
    type: '',
    year: '',
  });
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  
  // Use the new Redux-based favorites system
  const { favoritePublications } = useFavorites(user?.id);

  const loadPublications = async () => {
    setLoading(true);
    try {
      const params: any = {
        limit,
        offset,
      };

      if (searchQuery) params.q = searchQuery;
      if (filters.journal) params.journal = filters.journal;
      if (filters.type) params.type = filters.type;
      if (filters.year) params.year = parseInt(filters.year);

      const response = await apiService.searchPublications(params);

      if (response.success && response.data) {
        setPublications((response.data as any).publications);
        setTotal((response.data as any).total);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, [searchQuery, filters, offset]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    loadPublications();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOffset(0);
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Publications</h1>
          
          {user?.role === 'RESEARCHER' && (
            <div className="flex gap-2">
              <Link
                to="/publications/add"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">📚</span>
                Add Publication
              </Link>
              
              <button
                onClick={() => {
                  console.log('Debug - Favorite publications:', favoritePublications);
                  console.log('Debug - User ID:', user?.id);
                  alert(`Favorite publications: ${favoritePublications.length} items. Check console for details.`);
                }}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔍 Debug Publication Favorites
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.journal}
              onChange={(e) => handleFilterChange('journal', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Journals</option>
              <option value="Nature">Nature</option>
              <option value="Science">Science</option>
              <option value="Cell">Cell</option>
              <option value="The Lancet">The Lancet</option>
              <option value="NEJM">NEJM</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="JOURNAL">Journal</option>
              <option value="PREPRINT">Preprint</option>
              <option value="CONFERENCE">Conference</option>
              <option value="OTHER">Other</option>
            </select>

            <input
              type="number"
              placeholder="Year"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading publications...</p>
        </div>
      ) : publications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No publications found.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {publications.length} of {total} publications
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((publication) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                userId={user?.id}
                onFavoriteToggle={loadPublications}
              />
            ))}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-3 py-2 text-sm text-gray-700">
                  Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
                </span>

                <button
                  onClick={() => handlePageChange(offset + limit)}
                  disabled={offset + limit >= total}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PublicationCard: React.FC<{ publication: Publication; userId?: string | null; onFavoriteToggle?: () => void }> = ({ publication, userId, onFavoriteToggle }) => {
  const { togglePublicationFavorite } = useFavorites(userId || undefined);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            <Link
              to={`/publications/${publication.id}`}
              className="hover:text-blue-600"
            >
              {publication.title}
            </Link>
          </h3>

          {userId && (
            <FavoriteButton
              type="publication"
              itemId={publication.id}
              onToggle={() => {
                togglePublicationFavorite(publication.id);
                onFavoriteToggle?.();
              }}
              size="sm"
              className="ml-2"
            />
          )}
        </div>

        <div className="text-sm text-gray-600 mb-2">
          {publication.authors.length > 0 && (
            <p className="mb-1">
              <span className="font-medium">Authors:</span> {publication.authors.slice(0, 3).join(', ')}
              {publication.authors.length > 3 && ' et al.'}
            </p>
          )}

          {publication.journal && (
            <p className="mb-1">
              <span className="font-medium">Journal:</span> {publication.journal}
            </p>
          )}

          <div className="flex items-center justify-between">
            {publication.year && (
              <span className="text-sm text-gray-500">{publication.year}</span>
            )}
            <span className={`px-2 py-1 text-xs rounded-full ${
              publication.type === 'JOURNAL' ? 'bg-blue-100 text-blue-800' :
              publication.type === 'PREPRINT' ? 'bg-yellow-100 text-yellow-800' :
              publication.type === 'CONFERENCE' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {publication.type}
            </span>
          </div>
        </div>

        {publication.abstract && (
          <p className="text-sm text-gray-700 line-clamp-3 mt-3">
            {publication.abstract}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link
          to={`/publications/${publication.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Read more →
        </Link>

        {publication.doi && (
          <a
            href={`https://doi.org/${publication.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            DOI
          </a>
        )}
      </div>
    </div>
  );
};

export default PublicationsList;