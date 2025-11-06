import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl">🚫</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">Access Denied</h1>
        <p className="text-lg text-slate-600 mb-8">
          You don't have permission to access this page. Please check your account role or contact support.
        </p>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/contact" className="text-slate-500 hover:text-blue-600 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;