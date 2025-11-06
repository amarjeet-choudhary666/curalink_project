import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';

interface ClinicalTrialFormData {
  title: string;
  summary?: string;
  eligibility?: string;
  phase: string;
  status: string;
  locations: string;
  contactEmail?: string;
  startDate?: string;
  endDate?: string;
  externalUrl?: string;
  tags: string;
}

const AddClinicalTrial: React.FC = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicalTrialFormData>();

  // Redirect if not authenticated or not a researcher
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'RESEARCHER') {
      navigate('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const phases = [
    { value: 'PHASE_0', label: 'Phase 0' },
    { value: 'PHASE_1', label: 'Phase I' },
    { value: 'PHASE_2', label: 'Phase II' },
    { value: 'PHASE_3', label: 'Phase III' },
    { value: 'PHASE_4', label: 'Phase IV' },
    { value: 'N_A', label: 'N/A' },
  ];

  const statuses = [
    { value: 'RECRUITING', label: 'Recruiting' },
    { value: 'ACTIVE_NOT_RECRUITING', label: 'Active, not recruiting' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'TERMINATED', label: 'Terminated' },
    { value: 'UNKNOWN', label: 'Unknown' },
  ];

  const onSubmit = async (data: ClinicalTrialFormData) => {
    setError('');
    setIsSubmitting(true);

    try {
      // Process the form data
      const trialData = {
        title: data.title,
        summary: data.summary || undefined,
        eligibility: data.eligibility || undefined,
        phase: data.phase,
        status: data.status,
        locations: data.locations.split(',').map(loc => loc.trim()).filter(loc => loc.length > 0),
        contactEmail: data.contactEmail || undefined,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        externalUrl: data.externalUrl || undefined,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      };

      const response = await apiService.createClinicalTrial(trialData);

      if (response.success) {
        navigate('/clinical-trials', { 
          state: { message: 'Clinical trial created successfully!' } 
        });
      } else {
        setError(response.message || 'Failed to create clinical trial');
      }
    } catch (err) {
      setError('Failed to create clinical trial. Please try again.');
      console.error('Error creating trial:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading...</p>
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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Add Clinical Trial</h1>
          <p className="text-xl text-slate-600">
            Create a new clinical trial listing for researchers and patients
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Basic Information</h2>
              
              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Trial Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Trial title is required' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter the clinical trial title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Summary
                  </label>
                  <textarea
                    rows={4}
                    {...register('summary')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief summary of the clinical trial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Eligibility Criteria
                  </label>
                  <textarea
                    rows={6}
                    {...register('eligibility')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed eligibility criteria for participants"
                  />
                </div>
              </div>
            </div>

            {/* Trial Details */}
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Trial Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phase *
                  </label>
                  <select
                    {...register('phase', { required: 'Phase is required' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Phase</option>
                    {phases.map(phase => (
                      <option key={phase.value} value={phase.value}>
                        {phase.label}
                      </option>
                    ))}
                  </select>
                  {errors.phase && (
                    <p className="mt-1 text-sm text-red-600">{errors.phase.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status *
                  </label>
                  <select
                    {...register('status', { required: 'Status is required' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact & Location</h2>
              
              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Locations *
                  </label>
                  <input
                    type="text"
                    {...register('locations', { required: 'At least one location is required' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter locations separated by commas (e.g., New York, NY, Boston, MA)"
                  />
                  {errors.locations && (
                    <p className="mt-1 text-sm text-red-600">{errors.locations.message}</p>
                  )}
                  <p className="mt-1 text-sm text-slate-500">
                    Separate multiple locations with commas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    {...register('contactEmail')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    External URL
                  </label>
                  <input
                    type="url"
                    {...register('externalUrl')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://clinicaltrials.gov/ct2/show/NCT..."
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    Link to ClinicalTrials.gov or other external registry
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Tags & Keywords</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas (e.g., cancer, immunotherapy, phase 2)"
                />
                <p className="mt-1 text-sm text-slate-500">
                  Add relevant tags to help patients and researchers find this trial
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-3">⚠️</span>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/clinical-trials')}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Trial...
                  </div>
                ) : (
                  '🚀 Create Clinical Trial'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClinicalTrial;