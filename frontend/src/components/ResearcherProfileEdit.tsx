import React, { useState } from 'react';

interface ResearcherProfile {
  userId: string;
  specialties: string[];
  interests: string[];
  orcid?: string;
  researchgate?: string;
  availability: boolean;
  meta?: any;
}

interface ResearcherProfileEditProps {
  profile: ResearcherProfile;
  onSave: (updatedProfile: Partial<ResearcherProfile>) => void;
  onCancel: () => void;
  loading: boolean;
}

const ResearcherProfileEdit: React.FC<ResearcherProfileEditProps> = ({ profile, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    specialties: profile.specialties.join(', '),
    interests: profile.interests.join(', '),
    orcid: profile.orcid || '',
    researchgate: profile.researchgate || '',
    availability: profile.availability,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.specialties.trim()) {
      newErrors.specialties = 'At least one specialty is required';
    }

    if (!formData.interests.trim()) {
      newErrors.interests = 'At least one research interest is required';
    }

    if (formData.orcid && !/^\d{4}-\d{4}-\d{4}-\d{4}$|^\d{16}$/.test(formData.orcid.replace(/-/g, ''))) {
      newErrors.orcid = 'Invalid ORCID format (should be 16 digits or XXXX-XXXX-XXXX-XXXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedProfile: Partial<ResearcherProfile> = {
      specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
      interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
      orcid: formData.orcid || undefined,
      researchgate: formData.researchgate || undefined,
      availability: formData.availability,
    };

    onSave(updatedProfile);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Researcher Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-2">
            Specialties * (comma-separated)
          </label>
          <input
            type="text"
            id="specialties"
            name="specialties"
            value={formData.specialties}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.specialties ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Oncology, Cardiology, Neurology"
          />
          {errors.specialties && <p className="mt-1 text-sm text-red-600">{errors.specialties}</p>}
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
            Research Interests * (comma-separated)
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.interests ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Cancer Research, Drug Development, Clinical Trials"
          />
          {errors.interests && <p className="mt-1 text-sm text-red-600">{errors.interests}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="orcid" className="block text-sm font-medium text-gray-700 mb-2">
              ORCID ID
            </label>
            <input
              type="text"
              id="orcid"
              name="orcid"
              value={formData.orcid}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.orcid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="XXXX-XXXX-XXXX-XXXX"
            />
            {errors.orcid && <p className="mt-1 text-sm text-red-600">{errors.orcid}</p>}
          </div>

          <div>
            <label htmlFor="researchgate" className="block text-sm font-medium text-gray-700 mb-2">
              ResearchGate Profile
            </label>
            <input
              type="text"
              id="researchgate"
              name="researchgate"
              value={formData.researchgate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your ResearchGate username or ID"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="availability"
            name="availability"
            checked={formData.availability}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
            I am available for collaboration and consultations
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResearcherProfileEdit;