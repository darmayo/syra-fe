import React from 'react';
import { Shield } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-600" />
          </div>
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
          Loading SYRA Dashboard
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
          Initializing security monitoring system...
        </p>
      </div>
    </div>
  );
}