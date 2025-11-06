import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { apiService } from '../services/api';
import type { LoginResponse } from '../types/api';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'PATIENT' | 'RESEARCHER';
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');
  const selectedRole = watch('role');

  useEffect(() => {
    // Pre-select role from URL parameter
    const roleParam = searchParams.get('role');
    if (roleParam === 'patient') {
      setValue('role', 'PATIENT');
    } else if (roleParam === 'researcher') {
      setValue('role', 'RESEARCHER');
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await apiService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      // Auto-login after successful registration
      const loginResult = await apiService.login({
        email: data.email,
        password: data.password,
      });

      if (loginResult.success) {
        const loginData = loginResult.data as LoginResponse;
        dispatch(setCredentials({
          user: loginData.user,
          token: loginData.accessToken,
        }));

        // Redirect to profile setup based on role
        if (data.role === 'PATIENT') {
          navigate('/onboarding/patient');
        } else {
          navigate('/onboarding/researcher');
        }
      } else {
        // If auto-login fails, redirect to login page
        navigate('/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">CL</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Join CuraLink
          </h2>
          <p className="text-slate-600">
            Connect with healthcare opportunities that matter to you
          </p>
        </div>

        {/* Role Selection Cards (if no role pre-selected) */}
        {!selectedRole && (
          <div className="mb-8 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 text-center mb-4">
              I am a:
            </h3>
            <div className="grid gap-4">
              <button
                type="button"
                onClick={() => setValue('role', 'PATIENT')}
                className="p-6 border-2 border-slate-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-300 text-left group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Patient or Caregiver</h4>
                    <p className="text-sm text-slate-600">Find clinical trials, experts, and research</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue('role', 'RESEARCHER')}
                className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 text-left group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Researcher</h4>
                    <p className="text-sm text-slate-600">Connect with patients and collaborators</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {selectedRole && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                selectedRole === 'PATIENT' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                <span className="mr-2">
                  {selectedRole === 'PATIENT' ? '🏥' : '🔬'}
                </span>
                {selectedRole === 'PATIENT' ? 'Patient/Caregiver' : 'Researcher'}
              </div>
              <button
                type="button"
                onClick={() => setValue('role', '' as any)}
                className="ml-2 text-sm text-slate-500 hover:text-slate-700"
              >
                Change
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  type="password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedRole === 'PATIENT'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;