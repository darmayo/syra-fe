import React, { useState } from 'react';
import { X, Globe, Plus } from 'lucide-react';

interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (domain: { name: string; url: string }) => Promise<void>;
}

export function AddDomainModal({ isOpen, onClose, onAdd }: AddDomainModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Domain URL is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Extract domain name from URL
      const domainName = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      await onAdd({
        name: domainName,
        url: url.startsWith('http') ? url : `https://${url}`,
      });
      
      setUrl('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add domain');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Domain</h2>
              <p className="text-xs sm:text-sm text-gray-500">Monitor a new website for security threats</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="mb-6">
            <label htmlFor="domain-url" className="block text-sm sm:text-base font-semibold text-gray-700 mb-3">
              Domain URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="domain-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., trenteknologimobile.com or https://example.com"
                className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Enter the domain name or full URL you want to monitor
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 sm:py-4 text-sm sm:text-base bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add Domain
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}