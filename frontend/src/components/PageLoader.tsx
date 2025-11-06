import React from 'react';

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HF
                </span>
              </div>
            </div>
            
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin">
              <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Humanity Founder
          </span>
        </h2>
        <p className="text-slate-600 mb-6">{message}</p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;