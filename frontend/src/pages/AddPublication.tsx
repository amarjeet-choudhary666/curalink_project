import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';
import apiService from '../services/api';

const AddPublication: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    type: 'JOURNAL',
    doi: '',
    url: '',

  });

  const publicationTypes = [
    { value: 'JOURNAL', label: 'Journal Article' },
    { value: 'PREPRINT', label: 'Preprint' },
    { value: 'CONFERENCE', label: 'Conference Paper' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Convert authors string to array
      const authorsArray = formData.authors.split(',').map(author => author.trim()).filter(Boolean);
      
      const publicationData = {
        ...formData,
        authors: authorsArray,
        year: parseInt(formData.year.toString()),
      };

      const response = await apiService.createPublication(publicationData);
      
      if (response.success) {
        navigate('/publications');
      } else {
        setError(response.message || 'Failed to create publication');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create publication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Add Publication</h1>
          <p className="text-xl text-slate-600">
            Share your research with the scientific community
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter publication title"
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Abstract *
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter publication abstract"
              />
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Authors *
              </label>
              <input
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter authors separated by commas (e.g., John Doe, Jane Smith)"
              />
              <p className="text-sm text-slate-500 mt-1">Separate multiple authors with commas</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Journal */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Journal
                </label>
                <input
                  type="text"
                  name="journal"
                  value={formData.journal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Journal name"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Publication Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {publicationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* DOI */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  DOI
                </label>
                <input
                  type="text"
                  name="doi"
                  value={formData.doi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10.1000/xyz123"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/publication"
                />
              </div>
            </div>



            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/publications')}
                className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating...</span>
                  </span>
                ) : (
                  'Create Publication'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPublication;