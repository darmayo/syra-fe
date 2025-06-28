import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from './components/Header';
import { AttackStatsCard } from './components/AttackStatsCard';
import { DomainCard } from './components/DomainCard';
import { AddDomainModal } from './components/AddDomainModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useApi } from './hooks/useApi';
import { apiService } from './services/api';
import { Domain, SecurityLog, AttackStats, User } from './types';

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // API calls
  const { data: user, loading: userLoading, error: userError } = useApi<User>(
    () => apiService.getCurrentUser()
  );

  const {
    data: domains,
    loading: domainsLoading,
    error: domainsError,
    refetch: refetchDomains
  } = useApi<Domain[]>(
    () => apiService.getDomains()
  );

  const {
    data: securityLogs,
    loading: logsLoading,
    error: logsError
  } = useApi<SecurityLog[]>(
    () => apiService.getSecurityLogs()
  );

  const {
    data: attackStats,
    loading: statsLoading,
    error: statsError
  } = useApi<AttackStats>(
    () => apiService.getAttackStats()
  );

  const handleAddDomain = async (domainData: { name: string; url: string }) => {
    await apiService.addDomain(domainData);
    refetchDomains();
  };

  const handleDeleteDomain = async (domainId: string) => {
    await apiService.deleteDomain(domainId);
    refetchDomains();
  };

  const getLogsForDomain = (domainName: string): SecurityLog[] => {
    return securityLogs?.filter(log => log.agent_name === domainName) || [];
  };

  // Loading state
  if (userLoading || domainsLoading || logsLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (userError || domainsError || logsError || statsError) {
    const errorMessage = userError || domainsError || logsError || statsError || 'Unknown error';
    return (
      <ErrorMessage
        message={errorMessage}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={user} />

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 w-full">
        {/* Attack Statistics */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <AttackStatsCard
            stats={attackStats || { ddos: 0, sqlInjection: 0, xss: 0, total: 0 }}
            loading={statsLoading}
          />
        </div>

        {/* My Domain Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">My Domains</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline sm:hidden md:inline">Add New Domain</span>
            <span className="xs:hidden sm:inline md:hidden">Add Domain</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Domain Cards - Fixed to 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {domains?.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              logs={getLogsForDomain(domain.name)}
              onDelete={handleDeleteDomain}
            />
          ))}
        </div>

        {/* Empty state */}
        {domains?.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Plus className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">No domains added yet</h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
              Start monitoring your websites by adding your first domain to our security system.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
            >
              Add Your First Domain
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              © Copyright 2025 I Nyoman Darmayoga - All rights reserved.
            </div>
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
              SYRA - Secure Your Realm Always
            </div>
          </div>
        </div>
      </footer>

      {/* Add Domain Modal */}
      <AddDomainModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDomain}
      />
    </div>
  );
}

export default App;