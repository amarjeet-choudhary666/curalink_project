import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { apiService } from '../services/api';
import type { LoginResponse } from '../types/api';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await apiService.login(data);
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      // Store credentials in Redux store
      const loginData = result.data as LoginResponse;
      
      dispatch(setCredentials({
        user: loginData.user,
        token: loginData.accessToken,
      }));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'PATIENT' | 'RESEARCHER') => {
    setIsLoading(true);
    try {
      // Create demo accounts if they don't exist
      const demoCredentials = {
        email: role === 'PATIENT' ? 'patient@demo.com' : 'researcher@demo.com',
        password: 'demo123'
      };

      // Try to login first
      let result = await apiService.login(demoCredentials);
      
      if (!result.success) {
        // If login fails, create the demo account
        const registerResult = await apiService.register({
          name: role === 'PATIENT' ? 'Demo Patient' : 'Demo Researcher',
          email: demoCredentials.email,
          password: demoCredentials.password,
          role: role
        });

        if (registerResult.success) {
          // Now try to login again
          result = await apiService.login(demoCredentials);
        }
      }

      if (result.success) {
        const loginData = result.data as LoginResponse;
        
        dispatch(setCredentials({
          user: loginData.user,
          token: loginData.accessToken,
        }));
        navigate('/dashboard');
      } else {
        setError('Demo login failed. Please try manual login.');
      }
    } catch (err: any) {
      setError('Demo login failed. Please try manual login.');
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
            Welcome Back
          </h2>
          <p className="text-slate-600">
            Sign in to access your CuraLink dashboard
          </p>
        </div>

        {/* Demo Login Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 text-center mb-4">
            Quick Demo Access
          </h3>
          <div className="grid gap-3">
            <button
              onClick={() => handleDemoLogin('PATIENT')}
              className="w-full p-4 border-2 border-green-200 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 text-left group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🏥</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Demo Patient Login</h4>
                  <p className="text-sm text-slate-600">Explore as a patient looking for trials</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin('RESEARCHER')}
              className="w-full p-4 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 text-left group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🔬</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Demo Researcher Login</h4>
                  <p className="text-sm text-slate-600">Explore as a researcher managing trials</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-slate-500">Or sign in with your account</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;