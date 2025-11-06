import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { apiService } from '../services/api';

interface PatientOnboardingData {
  conditions: string;
  about: string;
  preferRemote: boolean;
}

const PatientOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PatientOnboardingData>();

  const conditions = watch('conditions');

  const commonConditions = [
    'Brain Cancer', 'Lung Cancer', 'Breast Cancer', 'Prostate Cancer',
    'Colorectal Cancer', 'Glioma', 'Melanoma', 'Leukemia',
    'Diabetes', 'Heart Disease', 'Alzheimer\'s', 'Parkinson\'s'
  ];

  const onSubmit = async (data: PatientOnboardingData) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Process conditions - split by comma and clean up
      const conditionsArray = data.conditions
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const result = await apiService.createPatientProfile({
        userId: user.id,
        conditions: conditionsArray,
        about: data.about,
        preferRemote: data.preferRemote,
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

  const addCondition = (condition: string) => {
    const currentConditions = conditions || '';
    const conditionsArray = currentConditions
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    
    if (!conditionsArray.includes(condition)) {
      const newConditions = [...conditionsArray, condition].join(', ');
      // Use setValue from react-hook-form
      const event = { target: { value: newConditions } };
      register('conditions').onChange(event);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome to CuraLink
          </h1>
          <p className="text-slate-600">
            Let's set up your profile to find the most relevant healthcare opportunities
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-500' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-600">
            <span>Medical Info</span>
            <span>Preferences</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-lg font-semibold text-slate-800 mb-4">
                    Tell us about your medical condition or area of interest
                  </label>
                  <p className="text-slate-600 mb-4">
                    You can describe this in natural language. For example: "I have brain cancer" or "I'm interested in diabetes research"
                  </p>
                  <textarea
                    {...register('conditions', { required: 'Please describe your condition or interest' })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="I have brain cancer and am looking for clinical trials..."
                  />
                  {errors.conditions && (
                    <p className="mt-1 text-sm text-red-600">{errors.conditions.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Or select from common conditions:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonConditions.map((condition) => (
                      <button
                        key={condition}
                        type="button"
                        onClick={() => addCondition(condition)}
                        className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-300 text-left"
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>



                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tell us more about yourself (Optional)
                  </label>
                  <textarea
                    {...register('about')}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Share anything else that might help us connect you with the right opportunities..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    {...register('preferRemote')}
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                  />
                  <label className="ml-2 text-sm text-slate-700">
                    I prefer remote consultations and virtual meetings when possible
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
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 px-6 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">What's next?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-medium text-slate-800">Discover Trials</h4>
              <p className="text-sm text-slate-600">Find clinical trials matching your condition</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👨‍⚕️</div>
              <h4 className="font-medium text-slate-800">Meet Experts</h4>
              <p className="text-sm text-slate-600">Connect with leading researchers and doctors</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-medium text-slate-800">Access Research</h4>
              <p className="text-sm text-slate-600">Stay updated with latest publications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOnboarding;