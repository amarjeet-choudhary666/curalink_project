import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiService } from '../services/api';

interface ResearcherOnboardingData {
  orcid: string;
  researchgate: string;
  availability: boolean;
}

const ResearcherOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResearcherOnboardingData>();

  const specialties = [
    'Oncology', 'Neurology', 'Cardiology', 'Immunology', 'Endocrinology',
    'Pulmonology', 'Gastroenterology', 'Dermatology', 'Psychiatry', 'Radiology',
    'Pathology', 'Surgery', 'Pediatrics', 'Geriatrics', 'Emergency Medicine'
  ];

  const researchInterests = [
    'Immunotherapy', 'Gene Therapy', 'Clinical AI', 'Drug Discovery',
    'Biomarkers', 'Precision Medicine', 'Stem Cell Research', 'Nanotechnology',
    'Medical Devices', 'Digital Health', 'Epidemiology', 'Public Health',
    'Regenerative Medicine', 'Pharmacology', 'Medical Imaging'
  ];

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const onSubmit = async (data: ResearcherOnboardingData) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await apiService.createResearcherProfile({
        userId: user.id,
        specialties: selectedSpecialties,
        interests: selectedInterests,
        orcid: data.orcid || undefined,
        researchgate: data.researchgate || undefined,
        availability: data.availability,
      });

      if (!result.success) {
        throw new Error(result.message || 'Profile creation failed');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🔬</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome to CuraLink
          </h1>
          <p className="text-slate-600">
            Set up your researcher profile to connect with patients and collaborators
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-600">
            <span>Specialties</span>
            <span>Interests</span>
            <span>Profile</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-lg font-semibold text-slate-800 mb-4">
                    What are your medical specialties?
                  </label>
                  <p className="text-slate-600 mb-4">
                    Select all areas where you have expertise or practice
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => toggleSpecialty(specialty)}
                        className={`px-4 py-3 text-sm border rounded-lg transition-all duration-300 text-left ${
                          selectedSpecialties.includes(specialty)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                  {selectedSpecialties.length === 0 && (
                    <p className="mt-2 text-sm text-red-600">Please select at least one specialty</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => selectedSpecialties.length > 0 && setStep(2)}
                  disabled={selectedSpecialties.length === 0}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-lg font-semibold text-slate-800 mb-4">
                    What are your research interests?
                  </label>
                  <p className="text-slate-600 mb-4">
                    Select areas you're actively researching or interested in
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {researchInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-3 text-sm border rounded-lg transition-all duration-300 text-left ${
                          selectedInterests.includes(interest)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {selectedInterests.length === 0 && (
                    <p className="mt-2 text-sm text-red-600">Please select at least one research interest</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 px-6 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => selectedInterests.length > 0 && setStep(3)}
                    disabled={selectedInterests.length === 0}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ORCID ID (Optional)
                    </label>
                    <input
                      {...register('orcid')}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="0000-0000-0000-0000"
                    />
                    <p className="mt-1 text-sm text-slate-500">
                      We'll auto-import your publications
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ResearchGate Profile (Optional)
                    </label>
                    <input
                      {...register('researchgate')}
                      type="url"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="https://www.researchgate.net/profile/..."
                    />
                    <p className="mt-1 text-sm text-slate-500">
                      Link to your ResearchGate profile
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('availability')}
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-slate-700">
                    I'm available for meetings with patients and collaborators
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 px-6 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Setting up...
                      </div>
                    ) : (
                      'Complete Setup'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Benefits Preview */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">What's next?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🤝</div>
              <h4 className="font-medium text-slate-800">Find Collaborators</h4>
              <p className="text-sm text-slate-600">Connect with researchers in your field</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-medium text-slate-800">Meet Patients</h4>
              <p className="text-sm text-slate-600">Connect with patients for your research</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-slate-800">Manage Trials</h4>
              <p className="text-sm text-slate-600">Add and manage your clinical trials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherOnboarding;