import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  favorites: any[];
}

const PublicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Decode token to get user ID (simplified - in real app use proper JWT decoding)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadPublication();
    }
  }, [id]);

  useEffect(() => {
    if (publication && userId) {
      checkIfFavorite();
    }
  }, [publication, userId]);

  const loadPublication = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await apiService.getPublicationById(id);
      if (response.success && response.data) {
        setPublication(response.data as Publication);
      }
    } catch (error) {
      console.error('Error loading publication:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = () => {
    if (!publication || !userId) return;
    const favorite = publication.favorites.find(fav => fav.userId === userId);
    setIsFavorite(!!favorite);
  };

  const toggleFavorite = async () => {
    if (!publication || !userId) return;

    try {
      if (isFavorite) {
        await apiService.removeFavoritePublication(userId, publication.id);
        setIsFavorite(false);
      } else {
        await apiService.addFavoritePublication(userId, publication.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading publication...</p>
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Publication not found.</p>
          <Link to="/publications" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Publications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/publications" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Publications
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{publication.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              {publication.authors.length > 0 && (
                <div>
                  <span className="font-medium">Authors:</span>{' '}
                  {publication.authors.join(', ')}
                </div>
              )}

              {publication.journal && (
                <div>
                  <span className="font-medium">Journal:</span> {publication.journal}
                </div>
              )}

              {publication.year && (
                <div>
                  <span className="font-medium">Year:</span> {publication.year}
                </div>
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

          {userId && (
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isFavorite
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg
                className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>
      </div>

      {/* Abstract */}
      {publication.abstract && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Abstract</h2>
          <p className="text-gray-700 leading-relaxed">{publication.abstract}</p>
        </div>
      )}

      {/* Links */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Links & Resources</h2>
        <div className="space-y-3">
          {publication.doi && (
            <div>
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
                DOI: {publication.doi}
              </a>
            </div>
          )}

          {publication.url && (
            <div>
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Original Publication
              </a>
            </div>
          )}

          {publication.researcher?.user?.name && (
            <div className="text-gray-600">
              <span className="font-medium">Researcher:</span> {publication.researcher.user.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;