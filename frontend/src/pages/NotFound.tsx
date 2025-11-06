import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 text-9xl font-bold text-blue-100 -z-10 transform translate-x-2 translate-y-2">
              404
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Page Not Found</h2>
          <p className="text-lg text-slate-600 mb-6">
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </p>
        </div>

        {/* Animated illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5.207-1.709L6 20l1.291-.793A7.962 7.962 0 014 12a8 8 0 018-8c4.418 0 8 3.582 8 8a7.962 7.962 0 01-1.709 5.207L20 18l-1.291-.793z" />
            </svg>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Take Me Home
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/about" className="text-slate-500 hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/contact" className="text-slate-500 hover:text-blue-600 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>

        {/* Fun fact */}
        <div className="mt-12 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-sm text-slate-500">
            <span className="font-semibold">Fun fact:</span> The first 404 error was discovered at CERN in 1992. 
            You're now part of internet history! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;