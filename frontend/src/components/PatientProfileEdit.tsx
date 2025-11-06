import React, { useState } from 'react';

interface PatientProfile {
  userId: string;
  conditions: string[];
  about?: string;
  preferRemote: boolean;
  preferences?: any;
}

interface PatientProfileEditProps {
  profile: PatientProfile;
  onSave: (updatedProfile: Partial<PatientProfile>) => void;
  onCancel: () => void;
  loading: boolean;
}

const PatientProfileEdit: React.FC<PatientProfileEditProps> = ({ profile, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    conditions: profile.conditions.join(', '),
    about: profile.about || '',
    preferRemote: profile.preferRemote,
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

    if (!formData.about.trim()) {
      newErrors.about = 'About section is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedProfile: Partial<PatientProfile> = {
      conditions: formData.conditions.split(',').map(c => c.trim()).filter(c => c),
      about: formData.about,
      preferRemote: formData.preferRemote,
    };

    onSave(updatedProfile);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Patient Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
            About *
          </label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.about ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tell us about yourself..."
          />
          {errors.about && <p className="mt-1 text-sm text-red-600">{errors.about}</p>}
        </div>

        <div>
          <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-2">
            Conditions (comma-separated)
          </label>
          <input
            type="text"
            id="conditions"
            name="conditions"
            value={formData.conditions}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Diabetes, Hypertension, Asthma"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="preferRemote"
            name="preferRemote"
            checked={formData.preferRemote}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="preferRemote" className="ml-2 block text-sm text-gray-700">
            I prefer remote consultations
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

export default PatientProfileEdit;