import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateCommunityMutation } from '../features/community/communityApi';
import type { RootState } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';
import apiService from '../services/api';

const CreateCommunity: React.FC = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  
  const [createCommunity, { isLoading, error: mutationError }] = useCreateCommunityMutation();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'GENERAL',
    isPrivate: false,
    rules: '',
  });

  const categories = [
    { value: 'GENERAL', label: 'General Discussion' },
    { value: 'ONCOLOGY', label: 'Oncology' },
    { value: 'NEUROLOGY', label: 'Neurology' },
    { value: 'CARDIOLOGY', label: 'Cardiology' },
    { value: 'IMMUNOLOGY', label: 'Immunology' },
    { value: 'ENDOCRINOLOGY', label: 'Endocrinology' },
    { value: 'PULMONOLOGY', label: 'Pulmonology' },
    { value: 'GASTROENTEROLOGY', label: 'Gastroenterology' },
    { value: 'DERMATOLOGY', label: 'Dermatology' },
    { value: 'PSYCHIATRY', label: 'Psychiatry' },
    { value: 'RADIOLOGY', label: 'Radiology' },
    { value: 'PATIENT_SUPPORT', label: 'Patient Support' },
    { value: 'RESEARCH', label: 'Research' },
    { value: 'CLINICAL_TRIALS', label: 'Clinical Trials' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Auto-generate slug from title
      if (name === 'title') {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        setFormData(prev => ({
          ...prev,
          slug: slug
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const communityData = {
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        title: formData.title,
        description: formData.description,
      };

      const result = await createCommunity(communityData).unwrap();
      
      if (result) {
        navigate('/community');
      }
    } catch (err: any) {
      setError(err.data?.message || err.message || 'Failed to create community');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Create Community</h1>
          <p className="text-xl text-slate-600">
            Start a new discussion space for researchers and patients
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || mutationError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error || (mutationError as any)?.data?.message || 'Failed to create community'}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Community Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter community title"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Community URL Slug *
              </label>
              <div className="flex items-center">
                <span className="text-slate-500 bg-slate-100 px-3 py-3 rounded-l-lg border border-r-0 border-slate-300">
                  /community/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  pattern="[a-z0-9-]+"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="community-url-slug"
                />
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Only lowercase letters, numbers, and hyphens allowed. Auto-generated from title.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what this community is about and what kind of discussions are welcome"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Privacy */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-slate-700">
                  Private Community
                </span>
              </label>
              <p className="text-sm text-slate-500 mt-1">
                Private communities require approval to join and are not visible in public listings
              </p>
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Community Rules (Optional)
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter community guidelines and rules (optional)"
              />
              <p className="text-sm text-slate-500 mt-1">
                Set clear guidelines to help maintain a positive and productive community environment
              </p>
            </div>

            {/* Preview */}
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Preview</h3>
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-slate-800">
                    {formData.title || 'Community Title'}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {formData.isPrivate && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        🔒 Private
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {categories.find(c => c.value === formData.category)?.label}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-2">
                  /community/{formData.slug || 'community-url-slug'}
                </p>
                <p className="text-slate-700">
                  {formData.description || 'Community description will appear here...'}
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating...</span>
                  </span>
                ) : (
                  'Create Community'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;